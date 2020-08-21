import * as React from "react";

import { CitationGroupPatterns_citationGroup } from "./__generated__/CitationGroupPatterns_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class CitationGroupPatterns extends React.Component<{
  citationGroup: CitationGroupPatterns_citationGroup;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { citationGroup, relay, title } = this.props;
    if (!citationGroup.patterns || citationGroup.patterns.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Patterns"}</h3>
        <ul>
          {citationGroup.patterns.edges.map(
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
  CitationGroupPatterns,
  {
    citationGroup: graphql`
      fragment CitationGroupPatterns_citationGroup on CitationGroup
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        patterns(first: $count, after: $cursor)
          @connection(key: "CitationGroupPatterns_patterns") {
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
    getConnectionFromProps: (props) => props.citationGroup.patterns,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupPatternsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupPatterns_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
