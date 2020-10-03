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
import { supportsChildren } from "../components/ModelChildList";

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
    const showExpandAll = %(type_lower)s.%(conn_lower)s.edges.some(edge => edge && edge.node && supportsChildren(edge.node));
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
          setExpandAll={showExpandAll ? (%(set_expand_all)s) : undefined}
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
              __typename
              ...ModelListEntry_model
              ...ModelChildList_model @relay(mask: false)
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
import { supportsChildren } from "../components/ModelChildList";

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
    const showExpandAll = %(conn_lower)s.edges.some(edge => edge && edge.node && supportsChildren(edge.node));
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
          setExpandAll={showExpandAll ? %(set_expand_all)s : undefined}
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
              __typename
              ...ModelListEntry_model
              ...ModelChildList_model @relay(mask: false)
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
import { %(type_upper)s%(conn_upper)s_%(type_lower)sInner } from "./__generated__/%(type_upper)s%(conn_upper)s_%(type_lower)sInner.graphql";
import { %(type_upper)s%(conn_upper)sDetailQuery } from "./__generated__/%(type_upper)s%(conn_upper)sDetailQuery.graphql";

import { createPaginationContainer, createFragmentContainer, QueryRenderer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import %(node_type_upper)sList from "../components/%(node_type_upper)sList";
import environment from "../relayEnvironment";

interface %(type_upper)s%(conn_upper)sInnerProps {
  %(type_lower)sInner: %(type_upper)s%(conn_upper)s_%(type_lower)sInner;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  showLocationDetail: boolean;
  showCitationDetail: boolean;
  showCollectionDetail: boolean;
  showEtymologyDetail: boolean;
  showNameDetail: boolean;
  setShowDetail?: (showDetail: boolean) => void;
  hideClassification?: boolean;
};

class %(type_upper)s%(conn_upper)sInner extends React.Component<
  %(type_upper)s%(conn_upper)sInnerProps
> {
  render() {
    const { %(type_lower)sInner, relay, numToLoad, hideTitle, title, showLocationDetail, showCitationDetail, showCollectionDetail, showEtymologyDetail, showNameDetail, setShowDetail, hideClassification } = this.props;
    if (
      !%(type_lower)sInner.%(conn_lower)s ||
      %(type_lower)sInner.%(conn_lower)s.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "%(conn_upper)s"}</h3>}
        <%(node_type_upper)sList connection={%(type_lower)sInner.%(conn_lower)s} hideClassification={hideClassification} />
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          showDetail={showLocationDetail || showCitationDetail || showCollectionDetail || showEtymologyDetail || showNameDetail}
          setShowDetail={setShowDetail}
        />
      </>
    );
  }
}

const %(type_upper)s%(conn_upper)sContainer = createPaginationContainer(
  %(type_upper)s%(conn_upper)sInner,
  {
    %(type_lower)sInner: graphql`
      fragment %(type_upper)s%(conn_upper)s_%(type_lower)sInner on %(type_upper)s
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
          showLocationDetail: { type: Boolean, defaultValue: false }
          showCitationDetail: { type: Boolean, defaultValue: false }
          showEtymologyDetail: { type: Boolean, defaultValue: false }
          showCollectionDetail: { type: Boolean, defaultValue: false }
          showNameDetail: { type: Boolean, defaultValue: false }
        ) {
        oid
        %(conn_lower)s(first: $count, after: $cursor)
          @connection(key: "%(type_upper)s%(conn_upper)s_%(conn_lower)s") {
          edges {
            node {
              oid
            }
          }
          ...%(node_type_upper)sList_connection @arguments(
            showLocationDetail: $showLocationDetail
            showCitationDetail: $showCitationDetail
            showCollectionDetail: $showCollectionDetail
            showEtymologyDetail: $showEtymologyDetail
            showNameDetail: $showNameDetail
          )
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.%(type_lower)sInner.%(conn_lower)s,
    getVariables(props, { count, cursor }, fragmentVariables) {
      const { showLocationDetail, showCitationDetail, showCollectionDetail, showEtymologyDetail, showNameDetail } = props;
      return {
        count,
        cursor,
        oid: props.%(type_lower)sInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
        showNameDetail
      };
    },
    query: graphql`
      query %(type_upper)s%(conn_upper)sPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
        $showNameDetail: Boolean!
      ) {
        %(type_lower)s(oid: $oid) {
          ...%(type_upper)s%(conn_upper)s_%(type_lower)sInner
            @arguments(
              count: $count
              cursor: $cursor
              showLocationDetail: $showLocationDetail
              showCitationDetail: $showCitationDetail
              showCollectionDetail: $showCollectionDetail
              showEtymologyDetail: $showEtymologyDetail
              showNameDetail: $showNameDetail
            )
        }
      }
    `,
  }
);

interface %(type_upper)s%(conn_upper)sProps {
  %(type_lower)s: %(type_upper)s%(conn_upper)s_%(type_lower)s;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  hideClassification?: boolean;
  showLocationDetail?: boolean;
  showCitationDetail?: boolean;
  showCollectionDetail?: boolean;
  showEtymologyDetail?: boolean;
  showNameDetail?: boolean;
};

class %(type_upper)s%(conn_upper)s extends React.Component<
  %(type_upper)s%(conn_upper)sProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: %(type_upper)s%(conn_upper)sProps) {
    super(props);
    const { showLocationDetail, showCitationDetail, showCollectionDetail, showEtymologyDetail, showNameDetail } = props;
    this.state = {
      showLocationDetail: showLocationDetail ?? false,
      showCitationDetail: showCitationDetail ?? false,
      showCollectionDetail: showCollectionDetail ?? false,
      showEtymologyDetail: showEtymologyDetail ?? false,
      showNameDetail: showNameDetail ?? false,
    };
  }

  renderInner(%(type_lower)s: Omit<%(type_upper)s%(conn_upper)s_%(type_lower)s, "oid" | " $refType">) {
    const { title, hideTitle, numToLoad, hideClassification } = this.props;
    const { showLocationDetail, showCitationDetail, showCollectionDetail, showEtymologyDetail, showNameDetail } = this.state;
    return <%(type_upper)s%(conn_upper)sContainer
      %(type_lower)sInner={%(type_lower)s}
      title={title}
      hideTitle={hideTitle}
      numToLoad={numToLoad}
      showLocationDetail={showLocationDetail}
      showCitationDetail={showCitationDetail}
      showCollectionDetail={showCollectionDetail}
      showEtymologyDetail={showEtymologyDetail}
      showNameDetail={showNameDetail}
      setShowDetail={%(set_show_detail)s}
      hideClassification={hideClassification}
    />
  }

  render() {
    const { %(type_lower)s } = this.props;
    const { showLocationDetail, showCitationDetail, showCollectionDetail, showEtymologyDetail, showNameDetail } = this.state;
    if (showLocationDetail || showCitationDetail || showCollectionDetail || showEtymologyDetail || showNameDetail) {
      return <QueryRenderer<%(type_upper)s%(conn_upper)sDetailQuery>
        environment={environment}
        query={graphql`
          query %(type_upper)s%(conn_upper)sDetailQuery(
            $oid: Int!
            $showLocationDetail: Boolean!
            $showCitationDetail: Boolean!
            $showCollectionDetail: Boolean!
            $showEtymologyDetail: Boolean!
            $showNameDetail: Boolean!
          ) {
            %(type_lower)s(oid: $oid) {
              ...%(type_upper)s%(conn_upper)s_%(type_lower)sInner
                @arguments(
                  showLocationDetail: $showLocationDetail
                  showCitationDetail: $showCitationDetail
                  showCollectionDetail: $showCollectionDetail
                  showEtymologyDetail: $showEtymologyDetail
                  showNameDetail: $showNameDetail
                )
            }
          }
        `}
        variables={{ 
          oid: %(type_lower)s.oid,
          showLocationDetail,
          showCitationDetail,
          showCollectionDetail,
          showEtymologyDetail,
          showNameDetail
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>Failed to load</div>;
          }
          if (!props || !props.%(type_lower)s) {
            return this.renderInner(%(type_lower)s);
          }
          return this.renderInner(props.%(type_lower)s);
        }}
      />;
    }
    return this.renderInner(%(type_lower)s);
  }
}

export default createFragmentContainer(%(type_upper)s%(conn_upper)s, {
  %(type_lower)s: graphql`
    fragment %(type_upper)s%(conn_upper)s_%(type_lower)s on %(type_upper)s
      @argumentDefinitions(
        showLocationDetail: { type: Boolean, defaultValue: false }
        showCitationDetail: { type: Boolean, defaultValue: false }
        showEtymologyDetail: { type: Boolean, defaultValue: false }
        showCollectionDetail: { type: Boolean, defaultValue: false }
        showNameDetail: { type: Boolean, defaultValue: false }
      ) {
      oid
      ...%(type_upper)s%(conn_upper)s_%(type_lower)sInner
        @arguments(
          showLocationDetail: $showLocationDetail
          showCitationDetail: $showCitationDetail
          showCollectionDetail: $showCollectionDetail
          showEtymologyDetail: $showEtymologyDetail
          showNameDetail: $showNameDetail
        )
    }
  `
});
"""
LIST_TYPES = {"Name"}
CHILDREN_TYPES = {"Period", "Region", "StratigraphicUnit"}


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
    if type_name in ("Period", "StratigraphicUnit") and conn_name != "locations":
        return False
    return True


def kind_of_detail(type_name: str) -> Optional[str]:
    if type_name == "Location":
        return "showLocationDetail"
    elif type_name == "Collection":
        return "showCollectionDetail"
    elif type_name == "CitationGroup":
        return "showCitationDetail"
    elif type_name in ("NameComplex", "SpeciesNameComplex"):
        return "showEtymologyDetail"
    elif type_name == "Taxon":
        return "showNameDetail"
    else:
        return None


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
    detail_field = kind_of_detail(type_name)
    args = {
        "type_upper": type_upper,
        "type_lower": type_lower,
        "conn_upper": conn_upper,
        "conn_lower": conn_lower,
        "node_type_upper": field_type,
        "set_expand_all": "(expandAll: boolean) => this.setState({ expandAll })"
        if field_type in ["Taxon", "Region", "Period", "Location", "Collection", "StratigraphicUnit"]
        else "undefined",
        "set_show_detail": f"showDetail => this.setState({{ {detail_field}: showDetail }})"
        if detail_field
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
