from pathlib import Path
import graphql
from typing import Iterable, Tuple

TEMPLATE = """

import * as React from "react";

import { %(type_upper)s%(conn_upper)s_%(type_lower)s } from "./__generated__/%(type_upper)s%(conn_upper)s_%(type_lower)s.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class %(type_upper)s%(conn_upper)s extends React.Component<{
  %(type_lower)s: %(type_upper)s%(conn_upper)s_%(type_lower)s;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { %(type_lower)s, relay, title } = this.props;
    if (!%(type_lower)s.%(conn_lower)s || %(type_lower)s.%(conn_lower)s.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "%(conn_upper)s"}</h3>
        <ul>
          {%(type_lower)s.%(conn_lower)s.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <li key={edge.node.oid}>
                  <ModelLink model={edge.node} />
                </li>
              )
          )}
        </ul>
        {relay.hasMore() && (
          <button onClick={() => this._loadMore()}>Load More</button>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(10, (error) => {
      console.log(error);
    });
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
              ...ModelLink_model
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
LIST_TEMPLATE = """
import * as React from "react";

import { %(type_upper)s%(conn_upper)s_%(type_lower)s } from "./__generated__/%(type_upper)s%(conn_upper)s_%(type_lower)s.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import %(node_type_upper)sList from "../components/%(node_type_upper)sList";

class %(type_upper)s%(conn_upper)s extends React.Component<{
  %(type_lower)s: %(type_upper)s%(conn_upper)s_%(type_lower)s;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { %(type_lower)s, relay, title } = this.props;
    if (
      !%(type_lower)s.%(conn_lower)s ||
      %(type_lower)s.%(conn_lower)s.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "%(conn_upper)s"}</h3>
        <%(node_type_upper)sList connection={%(type_lower)s.%(conn_lower)s} />
        {relay.hasMore() && (
          <button onClick={() => this._loadMore()}>Load More</button>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(10, (error) => {
      console.log(error);
    });
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


def write_component(
    type_name: str, conn_name: str, field_type: str, force: bool = False
) -> None:
    type_upper = type_name
    type_lower = lcfirst(type_name)
    conn_upper = ucfirst(conn_name)
    conn_lower = conn_name
    path = Path(f"src/lists/{type_upper}{conn_upper}.tsx")
    if not force and path.exists():
        print(f"{path} already exists; skipping")
        return
    args = {
        "type_upper": type_upper,
        "type_lower": type_lower,
        "conn_upper": conn_upper,
        "conn_lower": conn_lower,
        "node_type_upper": field_type,
    }
    if field_type in LIST_TYPES:
        text = LIST_TEMPLATE % args
    else:
        text = TEMPLATE % args
    path.write_text(text)


if __name__ == "__main__":
    for type_name, conn_name, field_type, in extract_connections(
        parse_graphql_schema()
    ):
        write_component(type_name, conn_name, field_type, force=True)
