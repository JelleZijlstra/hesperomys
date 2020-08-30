import * as React from "react";

import { TaxonOccurrences_taxon } from "./__generated__/TaxonOccurrences_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface TaxonOccurrencesProps {
  taxon: TaxonOccurrences_taxon;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class TaxonOccurrences extends React.Component<
  TaxonOccurrencesProps,
  { expandAll: boolean }
> {
  constructor(props: TaxonOccurrencesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { taxon, relay, numToLoad, hideTitle, title } = this.props;
    if (!taxon.occurrences || taxon.occurrences.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Occurrences"}</h3>}
        <ul>
          {taxon.occurrences.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                />
              )
          )}
        </ul>
        <LoadMoreButton
          numToLoad={numToLoad || 10}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={undefined}
        />
      </>
    );
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
              ...ModelListEntry_model
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
