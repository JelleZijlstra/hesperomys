import * as React from "react";

import { TaxonChildren_taxon } from "./__generated__/TaxonChildren_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class TaxonChildren extends React.Component<{
  taxon: TaxonChildren_taxon;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { taxon, relay, title } = this.props;
    if (!taxon.children || taxon.children.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Children"}</h3>
        <ul>
          {taxon.children.edges.map(
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
  TaxonChildren,
  {
    taxon: graphql`
      fragment TaxonChildren_taxon on Taxon
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "TaxonChildren_children") {
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
    getConnectionFromProps: (props) => props.taxon.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.taxon.oid,
      };
    },
    query: graphql`
      query TaxonChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        taxon(oid: $oid) {
          ...TaxonChildren_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
