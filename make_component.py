import argparse
from pathlib import Path

TEMPLATE = """
import { %(typename)s%(component)s_%(propname)s } from "./__generated__/%(typename)s%(component)s_%(propname)s.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class %(typename)s%(component)s extends React.Component<{
  %(propname)s: %(typename)s%(component)s_%(propname)s;
}> {
  render() {
    const { oid } = this.props.%(propname)s;
    return (
      <>
        {oid}
      </>
    );
  }
}

export default createFragmentContainer(%(typename)s%(component)s, {
  %(propname)s: graphql`
    fragment %(typename)s%(component)s_%(propname)s on %(typename)s {
      oid
    }
  `,
});
"""
ALL_CLASSES = [
    "Region",
    "CitationGroup",
    "CitationGroupPattern",
    "Article",
    "ArticleComment",
    "Collection",
    "Period",
    "Location",
    "Taxon",
    "SpeciesNameComplex",
    "NameComplex",
    "NameEnding",
    "SpeciesNameEnding",
    "Name",
    "NameComment",
    "Occurrence",
]


def lcfirst(s: str) -> str:
    return s[0].lower() + s[1:]


def create_file(typename: str, component: str):
    full_component = f"{typename}{component.title()}"
    filename = Path(f"src/{component}/{full_component}.tsx")
    if filename.exists():
        print(f"{filename} already exists; skipping")
        return

    propname = lcfirst(typename)
    text = TEMPLATE % {
        "typename": typename,
        "component": component.title(),
        "propname": propname,
    }
    filename.write_text(text)

    main_file = Path(f"src/{component}/{component.title()}.tsx")
    current = main_file.read_text()

    name_component = f"Name{component.title()}"
    name_import = f'import {name_component} from "./{name_component}";'
    current = current.replace(
        name_import,
        f'import {full_component} from "./{full_component}";\n{name_import}',
    )

    default_line = "      default:"
    current = current.replace(
        default_line,
        f'      case "{typename}":\n        return'
        f" <{full_component} {propname}={{model}} />;\n{default_line}",
    )

    name_spread = f"      ...{name_component}_name\n"
    current = current.replace(
        name_spread, f"{name_spread}      ...{full_component}_{propname}\n"
    )
    main_file.write_text(current)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("component")
    parser.add_argument("typename", nargs="?")
    args = parser.parse_args()
    if args.typename:
        create_file(args.typename, args.component)
    else:
        for cls in ALL_CLASSES:
            create_file(cls, args.component)
