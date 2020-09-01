from pathlib import Path
import graphql
import subprocess
from typing import Iterable, Tuple, Optional

TEMPLATE = """

import * as React from "react";

import { %(type_upper)s%(conn_upper)s_%(type_lower)s } from "./__generated__/%(type_upper)s%(conn_upper)s_%(type_lower)s.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface %(type_upper)s%(conn_upper)sProps {
  %(type_lower)s: %(type_upper)s%(conn_upper)s_%(type_lower)s;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
};

class %(type_upper)s%(conn_upper)s extends React.Component<
  %(type_upper)s%(conn_upper)sProps, { expandAll: boolean }
> {
  constructor(props: %(type_upper)s%(conn_upper)sProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { %(type_lower)s, relay, numToLoad, hideTitle, title } = this.props;
    if (!%(type_lower)s.%(conn_lower)s || %(type_lower)s.%(conn_lower)s.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "%(conn_upper)s"}</h3>}
        <ul>
          {%(type_lower)s.%(conn_lower)s.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} showChildren={this.state.expandAll} />
              )
          )}
        </ul>
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={%(set_expand_all)s}
        />
      </>
    );
  }
}

export default createPaginationContainer(
  %(type_upper)s%(conn_upper)s,
  {
    %(type_lower)s: graphql`
      fragment %(type_upper)s%(conn_upper)s_%(type_lower)s on %(type_upper)s
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        %(conn_lower)s(first: $count, after: $cursor)
          @connection(key: "%(type_upper)s%(conn_upper)s_%(conn_lower)s") {
          edges {
            node {
              oid
              ...ModelListEntry_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.%(type_lower)s.%(conn_lower)s,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.%(type_lower)s.oid,
      };
    },
    query: graphql`
      query %(type_upper)s%(conn_upper)sPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        %(type_lower)s(oid: $oid) {
          ...%(type_upper)s%(conn_upper)s_%(type_lower)s @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
"""

CHILDREN_TEMPLATE = """

import * as React from "react";

import { %(type_upper)s%(conn_upper)s_%(type_lower)s } from "./__generated__/%(type_upper)s%(conn_upper)s_%(type_lower)s.graphql";
import { %(type_upper)s%(conn_upper)sChildrenQuery } from "./__generated__/%(type_upper)s%(conn_upper)sChildrenQuery.graphql";

import { createPaginationContainer, RelayPaginationProp, QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import environment from "../relayEnvironment";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "../components/ModelLink";
import ModelListEntry from "../components/ModelListEntry";

interface %(type_upper)s%(conn_upper)sProps {
  %(type_lower)s: %(type_upper)s%(conn_upper)s_%(type_lower)s;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
};

class %(type_upper)s%(conn_upper)s extends React.Component<
  %(type_upper)s%(conn_upper)sProps, { expandAll: boolean, showChildren: boolean }
> {
  constructor(props: %(type_upper)s%(conn_upper)sProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const { %(type_lower)s, relay, numToLoad, hideTitle, title } = this.props;
    const { oid, numChildren, %(conn_lower)s } = %(type_lower)s;
    if (!%(conn_lower)s || (numChildren === 0 && %(conn_lower)s.edges.length === 0)) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "%(conn_upper)s"}</h3>}
        {this.state.showChildren &&
        <QueryRenderer<%(type_upper)s%(conn_upper)sChildrenQuery>
          environment={environment}
          query={graphql`
            query %(type_upper)s%(conn_upper)sChildrenQuery($oid: Int!) {
              %(type_lower)s(oid: $oid) {
                children(first: 1000) {
                  edges {
                    node {
                      has%(conn_upper)s
                      ...%(type_upper)s%(conn_upper)s_%(type_lower)s
                      ...ModelLink_model
                    }
                  }
                }
              }
            }
          `}
          variables={{ oid }}
          render={({ error, props }) => {
            if (error) {
              return <div>Failed to load</div>;
            }
            if (!props || !props.%(type_lower)s || !props.%(type_lower)s.children) {
              return <div>Loading...</div>;
            }
            const { edges } = props.%(type_lower)s.children;
            return <ul>
              {edges.map(edge => edge && edge.node && edge.node.has%(conn_upper)s && <li>
                <ModelLink model={edge.node} />
                <%(type_upper)s%(conn_upper)sContainer %(type_lower)s={edge.node} hideTitle />
              </li>)}
            </ul>;
          }}
        />}
        <ul>
          {%(conn_lower)s.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} showChildren={this.state.expandAll} />
              )
          )}
        </ul>
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={%(conn_lower)s.edges.length > 0 ? %(set_expand_all)s : undefined}
          showChildren={this.state.showChildren}
          setShowChildren={numChildren > 0 ? showChildren => this.setState({ showChildren }) : undefined}
        />
      </>
    );
  }
}

const %(type_upper)s%(conn_upper)sContainer = createPaginationContainer(
  %(type_upper)s%(conn_upper)s,
  {
    %(type_lower)s: graphql`
      fragment %(type_upper)s%(conn_upper)s_%(type_lower)s on %(type_upper)s
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        numChildren
        %(conn_lower)s(first: $count, after: $cursor)
          @connection(key: "%(type_upper)s%(conn_upper)s_%(conn_lower)s") {
          edges {
            node {
              oid
              ...ModelListEntry_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.%(type_lower)s.%(conn_lower)s,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.%(type_lower)s.oid,
      };
    },
    query: graphql`
      query %(type_upper)s%(conn_upper)sPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        %(type_lower)s(oid: $oid) {
          ...%(type_upper)s%(conn_upper)s_%(type_lower)s @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

export default %(type_upper)s%(conn_upper)sContainer;
"""

LIST_TEMPLATE = """
import * as React from "react";

import { %(type_upper)s%(conn_upper)s_%(type_lower)s } from "./__generated__/%(type_upper)s%(conn_upper)s_%(type_lower)s.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import %(node_type_upper)sList from "../components/%(node_type_upper)sList";

interface %(type_upper)s%(conn_upper)sProps {
  %(type_lower)s: %(type_upper)s%(conn_upper)s_%(type_lower)s;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
};

class %(type_upper)s%(conn_upper)s extends React.Component<
  %(type_upper)s%(conn_upper)sProps
> {
  render() {
    const { %(type_lower)s, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !%(type_lower)s.%(conn_lower)s ||
      %(type_lower)s.%(conn_lower)s.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "%(conn_upper)s"}</h3>}
        <%(node_type_upper)sList connection={%(type_lower)s.%(conn_lower)s} />
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  %(type_upper)s%(conn_upper)s,
  {
    %(type_lower)s: graphql`
      fragment %(type_upper)s%(conn_upper)s_%(type_lower)s on %(type_upper)s
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        %(conn_lower)s(first: $count, after: $cursor)
          @connection(key: "%(type_upper)s%(conn_upper)s_%(conn_lower)s") {
          edges {
            node {
              oid
            }
          }
          ...%(node_type_upper)sList_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.%(type_lower)s.%(conn_lower)s,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.%(type_lower)s.oid,
      };
    },
    query: graphql`
      query %(type_upper)s%(conn_upper)sPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        %(type_lower)s(oid: $oid) {
          ...%(type_upper)s%(conn_upper)s_%(type_lower)s
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
"""
LIST_TYPES = {"Name"}
CHILDREN_TYPES = {"Period", "Region"}


def lcfirst(s: str) -> str:
    return s[0].lower() + s[1:]


def ucfirst(s: str) -> str:
    return s[0].upper() + s[1:]


def parse_graphql_schema() -> graphql.language.ast.DocumentNode:
    schema_file = Path("hesperomys.graphql")
    schema_text = schema_file.read_text()
    return graphql.parse(schema_text)


def extract_connections(
    schema: graphql.language.ast.DocumentNode,
) -> Iterable[Tuple[str, str, str]]:
    for defn in schema.definitions:
        if not isinstance(defn, graphql.language.ast.ObjectTypeDefinitionNode):
            continue
        for field in defn.fields:
            if not isinstance(field.type, graphql.language.ast.NamedTypeNode):
                continue
            field_type = field.type.name.value
            if not field_type.endswith("Connection"):
                continue
            yield (defn.name.value, field.name.value, field_type[: -len("Connection")])


def should_use_children_template(type_name: str, conn_name: str) -> bool:
    if type_name not in CHILDREN_TYPES or conn_name == "children":
        return False
    if type_name == "Period" and conn_name != "locationsStratigraphy":
        return False
    return True


def write_component(
    type_name: str, conn_name: str, field_type: str, force: bool = False
) -> Optional[Path]:
    type_upper = type_name
    type_lower = lcfirst(type_name)
    conn_upper = ucfirst(conn_name)
    conn_lower = conn_name
    path = Path(f"src/lists/{type_upper}{conn_upper}.tsx")
    if not force and path.exists():
        print(f"{path} already exists; skipping")
        return None
    args = {
        "type_upper": type_upper,
        "type_lower": type_lower,
        "conn_upper": conn_upper,
        "conn_lower": conn_lower,
        "node_type_upper": field_type,
        "set_expand_all": "(expandAll: boolean) => this.setState({ expandAll })"
        if field_type in ["Taxon", "Region", "Period", "Location", "Collection"]
        else "undefined",
    }
    if field_type in LIST_TYPES:
        text = LIST_TEMPLATE % args
    elif should_use_children_template(type_name, conn_name):
        text = CHILDREN_TEMPLATE % args
    else:
        text = TEMPLATE % args
    path.write_text(text)
    return path


if __name__ == "__main__":
    paths = [
        write_component(type_name, conn_name, field_type, force=True)
        for type_name, conn_name, field_type, in extract_connections(
            parse_graphql_schema()
        )
    ]
    subprocess.check_call(
        ["prettier", "--write", *[str(path) for path in paths if path is not None]]
    )
