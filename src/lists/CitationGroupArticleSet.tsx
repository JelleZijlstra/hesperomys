import * as React from "react";

import { CitationGroupArticleSet_citationGroup } from "./__generated__/CitationGroupArticleSet_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface CitationGroupArticleSetProps {
  citationGroup: CitationGroupArticleSet_citationGroup;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class CitationGroupArticleSet extends React.Component<
  CitationGroupArticleSetProps
> {
  render() {
    const { citationGroup, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !citationGroup.articleSet ||
      citationGroup.articleSet.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "ArticleSet"}</h3>}
        <ul>
          {citationGroup.articleSet.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  CitationGroupArticleSet,
  {
    citationGroup: graphql`
      fragment CitationGroupArticleSet_citationGroup on CitationGroup
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        articleSet(first: $count, after: $cursor)
          @connection(key: "CitationGroupArticleSet_articleSet") {
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
    getConnectionFromProps: (props) => props.citationGroup.articleSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupArticleSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupArticleSet_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
