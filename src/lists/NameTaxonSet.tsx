import * as React from "react";

import { NameTaxonSet_name } from "./__generated__/NameTaxonSet_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class NameTaxonSet extends React.Component<{
  name: NameTaxonSet_name;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { name, relay, title } = this.props;
    if (!name.taxonSet || name.taxonSet.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "TaxonSet"}</h3>
        <ul>
          {name.taxonSet.edges.map(
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
  NameTaxonSet,
  {
    name: graphql`
      fragment NameTaxonSet_name on Name
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        taxonSet(first: $count, after: $cursor)
          @connection(key: "NameTaxonSet_taxonSet") {
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
    getConnectionFromProps: (props) => props.name.taxonSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameTaxonSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        name(oid: $oid) {
          ...NameTaxonSet_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
