import * as React from "react";

import { TaxonOccurrences_taxon } from "./__generated__/TaxonOccurrences_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class TaxonOccurrences extends React.Component<{
  taxon: TaxonOccurrences_taxon;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { taxon, relay, title } = this.props;
    if (!taxon.occurrences || taxon.occurrences.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Occurrences"}</h3>
        <ul>
          {taxon.occurrences.edges.map(
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
  TaxonOccurrences,
  {
    taxon: graphql`
      fragment TaxonOccurrences_taxon on Taxon
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        occurrences(first: $count, after: $cursor)
          @connection(key: "TaxonOccurrences_occurrences") {
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
    getConnectionFromProps: (props) => props.taxon.occurrences,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.taxon.oid,
      };
    },
    query: graphql`
      query TaxonOccurrencesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        taxon(oid: $oid) {
          ...TaxonOccurrences_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
