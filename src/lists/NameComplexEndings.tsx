import * as React from "react";

import { NameComplexEndings_nameComplex } from "./__generated__/NameComplexEndings_nameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface NameComplexEndingsProps {
  nameComplex: NameComplexEndings_nameComplex;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class NameComplexEndings extends React.Component<
  NameComplexEndingsProps,
  { expandAll: boolean }
> {
  constructor(props: NameComplexEndingsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { nameComplex, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "NameComplex";
    if (!nameComplex.endings || nameComplex.endings.edges.length === 0) {
      return null;
    }
    const showExpandAll = nameComplex.endings.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Endings"} ({nameComplex.numEndings})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {nameComplex.endings.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                  context={context}
                />
              ),
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad} relay={relay} />
      </>
    );
    if (wrapperTitle) {
      return (
        <div>
          <i>{wrapperTitle}</i>
          {inner}
        </div>
      );
    }
    return inner;
  }
}

export default createPaginationContainer(
  NameComplexEndings,
  {
    nameComplex: graphql`
      fragment NameComplexEndings_nameComplex on NameComplex
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numEndings
        endings(first: $count, after: $cursor)
          @connection(key: "NameComplexEndings_endings") {
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
    getConnectionFromProps: (props) => props.nameComplex.endings,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.nameComplex.oid,
      };
    },
    query: graphql`
      query NameComplexEndingsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        nameComplex(oid: $oid) {
          ...NameComplexEndings_nameComplex @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
