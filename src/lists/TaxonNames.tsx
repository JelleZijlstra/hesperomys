import * as React from "react";

import { TaxonNames_taxon } from "./__generated__/TaxonNames_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface TaxonNamesProps {
  taxon: TaxonNames_taxon;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class TaxonNames extends React.Component<TaxonNamesProps> {
  render() {
    const { taxon, relay, numToLoad, hideTitle, title } = this.props;
    if (!taxon.names || taxon.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Names"}</h3>}
        <NameList connection={taxon.names} />
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
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
            }
          }
          ...NameList_connection
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
