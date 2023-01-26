import * as React from "react";

import { TaxonOccurrences_taxon } from "./__generated__/TaxonOccurrences_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface TaxonOccurrencesProps {
  taxon: TaxonOccurrences_taxon;
  title?: string;
  subtitle?: JSX.Element;
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
    const { taxon, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!taxon.occurrences || taxon.occurrences.edges.length === 0) {
      return null;
    }
    const showExpandAll = taxon.occurrences.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Occurrences"}</h3>}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
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
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
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
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        occurrences(first: $count, after: $cursor)
          @connection(key: "TaxonOccurrences_occurrences") {
          edges {
            node {
              oid
              __typename
              ...ModelListEntry_model
              ...ModelChildList_model @relay(mask: false)
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
      query TaxonOccurrencesPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        taxon(oid: $oid) {
          ...TaxonOccurrences_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
