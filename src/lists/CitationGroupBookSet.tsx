import * as React from "react";

import { CitationGroupBookSet_citationGroup } from "./__generated__/CitationGroupBookSet_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface CitationGroupBookSetProps {
  citationGroup: CitationGroupBookSet_citationGroup;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class CitationGroupBookSet extends React.Component<
  CitationGroupBookSetProps,
  { expandAll: boolean }
> {
  constructor(props: CitationGroupBookSetProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const {
      citationGroup,
      relay,
      numToLoad,
      hideTitle,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const context = this.props.context || "CitationGroup";
    if (!citationGroup.bookSet || citationGroup.bookSet.edges.length === 0) {
      return null;
    }
    const showExpandAll = citationGroup.bookSet.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "BookSet"} ({citationGroup.numBookSet})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {citationGroup.bookSet.edges.map(
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
  CitationGroupBookSet,
  {
    citationGroup: graphql`
      fragment CitationGroupBookSet_citationGroup on CitationGroup
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numBookSet
        bookSet(first: $count, after: $cursor)
          @connection(key: "CitationGroupBookSet_bookSet") {
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
    getConnectionFromProps: (props) => props.citationGroup.bookSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupBookSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupBookSet_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
