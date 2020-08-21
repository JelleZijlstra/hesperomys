import * as React from "react";

import { TaxonNames_taxon } from "./__generated__/TaxonNames_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class TaxonNames extends React.Component<{
  taxon: TaxonNames_taxon;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { taxon, relay, title } = this.props;
    if (!taxon.names || taxon.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Names"}</h3>
        <ul>
          {taxon.names.edges.map(
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
  TaxonNames,
  {
    taxon: graphql`
      fragment TaxonNames_taxon on Taxon
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "TaxonNames_names") {
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
    getConnectionFromProps: (props) => props.taxon.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.taxon.oid,
      };
    },
    query: graphql`
      query TaxonNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        taxon(oid: $oid) {
          ...TaxonNames_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
