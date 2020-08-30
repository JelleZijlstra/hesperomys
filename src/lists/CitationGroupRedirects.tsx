import * as React from "react";

import { CitationGroupRedirects_citationGroup } from "./__generated__/CitationGroupRedirects_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface CitationGroupRedirectsProps {
  citationGroup: CitationGroupRedirects_citationGroup;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class CitationGroupRedirects extends React.Component<
  CitationGroupRedirectsProps
> {
  render() {
    const { citationGroup, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !citationGroup.redirects ||
      citationGroup.redirects.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Redirects"}</h3>}
        <ul>
          {citationGroup.redirects.edges.map(
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
  CitationGroupRedirects,
  {
    citationGroup: graphql`
      fragment CitationGroupRedirects_citationGroup on CitationGroup
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        redirects(first: $count, after: $cursor)
          @connection(key: "CitationGroupRedirects_redirects") {
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
    getConnectionFromProps: (props) => props.citationGroup.redirects,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupRedirectsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupRedirects_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
