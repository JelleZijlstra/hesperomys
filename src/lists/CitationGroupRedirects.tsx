import * as React from "react";

import { CitationGroupRedirects_citationGroup } from "./__generated__/CitationGroupRedirects_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class CitationGroupRedirects extends React.Component<{
  citationGroup: CitationGroupRedirects_citationGroup;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { citationGroup, relay, title } = this.props;
    if (
      !citationGroup.redirects ||
      citationGroup.redirects.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "Redirects"}</h3>
        <ul>
          {citationGroup.redirects.edges.map(
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
              ...ModelLink_model
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
