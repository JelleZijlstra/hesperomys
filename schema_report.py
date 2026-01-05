#!/usr/bin/env python3
"""
Generate a report of GraphQL schema fields that are not queried by the
frontend (approximation for "not displayed").

- Parses the schema to collect object/interface types and fields.
- Scans frontend source for Relay `graphql` template literals.
- Heuristically marks fields as used if their name appears in selections.
- Groups results by GraphQL interfaces implemented by each type.
- Applies filters to remove noisy entries (connections, num*, etc.).

Usage:
  python schema_report.py \
    --schema hesperomys.graphql \
    --src src \
    --out SCHEMA_FIELDS_NOT_DISPLAYED.md
"""

from __future__ import annotations

import argparse
import os
import re
from pathlib import Path


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--schema", default="hesperomys.graphql")
    p.add_argument("--src", default="src")
    p.add_argument("--out", default="SCHEMA_FIELDS_NOT_DISPLAYED.md")
    return p.parse_args()


def load_schema(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def collect_types_and_fields(
    schema: str,
) -> tuple[set[str], dict[str, list[str]], dict[str, list[str]]]:
    interfaces: set[str] = set()
    obj_types: dict[str, list[str]] = {}
    type_interfaces: dict[str, list[str]] = {}

    current_type: str | None = None
    for line in schema.splitlines():
        m_int = re.match(r"^interface\s+(\w+)\b", line)
        if m_int:
            interfaces.add(m_int.group(1))
            current_type = None
            continue
        m_type = re.match(r"^type\s+(\w+)\b(?:\s+implements\s+([^\{]+))?", line)
        if m_type:
            tname = m_type.group(1)
            obj_types.setdefault(tname, [])
            impl = m_type.group(2)
            if impl:
                names = [s.strip() for s in re.split(r"[&,,]", impl) if s.strip()]
                type_interfaces[tname] = names
            current_type = tname
            continue
        if current_type is None:
            continue
        if line.strip().startswith(
            ("type ", "interface ", "union ", "input ", "scalar ", "enum ", "schema ")
        ):
            current_type = None
            continue
        if line.strip().startswith("}"):
            current_type = None
            continue
        m_field = re.match(r"\s*(\w+)\s*(\(|:)", line)
        if m_field:
            field = m_field.group(1)
            obj_types.setdefault(current_type, []).append(field)
    return interfaces, obj_types, type_interfaces


def gather_frontend_graphql(src_root: str) -> list[str]:
    queries: list[str] = []
    for root_str, _, files in os.walk(src_root):
        root = Path(root_str)
        for fn in files:
            if not fn.endswith((".ts", ".tsx", ".js", ".jsx")):
                continue
            p = root / fn
            try:
                txt = p.read_text(encoding="utf-8")
            except Exception:
                continue
            queries += [m.group(1) for m in re.finditer(r"graphql`([\s\S]*?)`", txt)]
    return queries


def compute_used_fields_and_types(all_graphql: list[str]) -> tuple[set[str], set[str]]:
    """
    Heuristically extract field names and type names from GraphQL selections.

    - Adds tokens before ':' or '(' (aliases or fields with args)
    - Adds tokens after ':' (right-hand side of alias -> actual field)
    - Adds tokens that look like bare field selections at the start of lines
      inside selection blocks (best-effort; skips GraphQL keywords and '...')
    - Adds typename references from inline fragments ('on Type')
    """
    text = "\n".join(all_graphql)
    used_fields: set[str] = set()
    graphql_keywords = {
        "fragment",
        "query",
        "mutation",
        "subscription",
        "on",
        "implements",
        "schema",
        "type",
        "interface",
        "union",
        "input",
        "directive",
        "extend",
    }
    for g in all_graphql:
        # alias or field with args/typed positions
        for m in re.finditer(r"\b(\w+)\b\s*[:(]", g):
            used_fields.add(m.group(1))
        # RHS of alias: alias: fieldName
        for m in re.finditer(r":\s*(\w+)\b", g):
            used_fields.add(m.group(1))
        # Bare field selections at start of lines
        for line in g.splitlines():
            line = line.strip()
            if not line or line.startswith(("}", "...")):
                continue
            match = re.match(r"^(\w+)\b", line)
            if not match:
                continue
            token = match.group(1)
            if token in graphql_keywords:
                continue
            used_fields.add(token)
    # typename references in inline fragments
    used_type_names: set[str] = set(re.findall(r"\bon\s+(\w+)\b", text))
    return used_fields, used_type_names


FIELD_EXACT_EXCLUDE = {"_Ignored", "edges", "pageInfo", "pageTitle"}
FIELD_PREFIX_EXCLUDE = ("num",)
TYPE_EXACT_EXCLUDE = {"PageInfo"}
TYPE_SUFFIX_EXCLUDE = ("Connection", "Edge")


def type_allowed(t: str) -> bool:
    if t in TYPE_EXACT_EXCLUDE:
        return False
    if any(t.endswith(suf) for suf in TYPE_SUFFIX_EXCLUDE):
        return False
    return True


def field_allowed(f: str) -> bool:
    if f in FIELD_EXACT_EXCLUDE:
        return False
    if any(f.startswith(pref) for pref in FIELD_PREFIX_EXCLUDE):
        return False
    return True


def build_groupings(
    interfaces: set[str],
    obj_types: dict[str, list[str]],
    type_interfaces: dict[str, list[str]],
) -> tuple[dict[str, list[str]], list[str]]:
    interfaces_sorted = sorted(interfaces)
    by_interface: dict[str, list[str]] = {iface: [] for iface in interfaces_sorted}
    no_interface: list[str] = []
    for t in sorted([t for t in obj_types if type_allowed(t)]):
        impls = [i for i in type_interfaces.get(t, []) if i in interfaces]
        if impls:
            for i in impls:
                by_interface.setdefault(i, []).append(t)
        else:
            no_interface.append(t)
    return by_interface, no_interface


def main() -> None:
    args = parse_args()
    schema = load_schema(args.schema)
    interfaces, obj_types, type_interfaces = collect_types_and_fields(schema)

    all_graphql = gather_frontend_graphql(args.src)
    used_fields, used_type_names = compute_used_fields_and_types(all_graphql)

    # Never referenced types (filtered)
    never_referenced_types = sorted(
        [t for t in obj_types if type_allowed(t) and t not in used_type_names]
    )

    # Unused fields per type (filtered)
    unused: dict[str, list[str]] = {}
    for t, fields in obj_types.items():
        if not type_allowed(t):
            continue
        missing = [
            field
            for field in fields
            if field_allowed(field) and field not in used_fields
        ]
        if missing:
            unused[t] = missing

    by_interface, no_interface = build_groupings(interfaces, obj_types, type_interfaces)

    lines: list[str] = []
    lines.append(
        "This report lists schema fields not detected in any frontend GraphQL selection.\n"
    )
    lines.append(
        "Filters applied:\n- Exclude fields: _Ignored, edges, pageInfo, pageTitle, and any starting with 'num'.\n- Exclude types: any *Connection, *Edge, and PageInfo.\n"
    )
    lines.append(
        "Heuristics:\n- A field is considered used if it is selected in any `graphql` template "
        "(aliases, args, and bare selections are detected heuristically).\n- Type context is ignored; common names like `id`/`name` may be overcounted as used.\n- ‘Displayed’ is approximated by ‘queried somewhere in the UI’.\n"
    )
    lines.append("Summary:\n")
    lines.append(
        f"Total object/interface types scanned: {sum(1 for t in obj_types if type_allowed(t))}"
    )
    lines.append(f"Types with at least one unused field: {len(unused)}")
    lines.append("")

    # Types never referenced, grouped by interface
    lines.append("Types never referenced in fragments/queries, grouped by interface:")
    for iface in sorted(by_interface.keys()):
        group_types = [
            t for t in by_interface.get(iface, []) if t in never_referenced_types
        ]
        if not group_types:
            continue
        lines.append(f"- Interface {iface}:")
        lines += [f"  - {t}" for t in group_types]
    other_never = [t for t in no_interface if t in never_referenced_types]
    if other_never:
        lines.append("- Without interface:")
        lines += [f"  - {t}" for t in other_never]
    lines.append("")

    # Unused fields grouped by interface
    lines.append("Unused fields grouped by interface:")
    for iface in sorted(by_interface.keys()):
        ts = [t for t in by_interface.get(iface, []) if t in unused]
        if not ts:
            continue
        lines.append(f"\n## Interface: {iface}")
        for t in sorted(ts):
            lines.append(f"### {t}")
            lines += [f"- {t}.{f}" for f in sorted(unused[t])]
            lines.append("")

    # Without interface section
    ts = [t for t in no_interface if t in unused]
    if ts:
        lines.append("\n## Without Interface")
        for t in sorted(ts):
            lines.append(f"### {t}")
            lines += [f"- {t}.{f}" for f in sorted(unused[t])]
            lines.append("")

    with open(args.out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print("Wrote:", args.out)


if __name__ == "__main__":
    main()
