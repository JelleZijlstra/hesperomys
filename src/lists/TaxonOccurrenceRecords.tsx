import * as React from "react";

import { TaxonOccurrenceRecords_taxon } from "./__generated__/TaxonOccurrenceRecords_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface TaxonOccurrenceRecordsProps {
  taxon: TaxonOccurrenceRecords_taxon;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class TaxonOccurrenceRecords extends React.Component<
  TaxonOccurrenceRecordsProps,
  { expandAll: boolean }
> {
  constructor(props: TaxonOccurrenceRecordsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { taxon, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Taxon";
    if (!taxon.occurrenceRecords || taxon.occurrenceRecords.edges.length === 0) {
      return null;
    }
    const showExpandAll = taxon.occurrenceRecords.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Occurrence records"} ({taxon.numOccurrenceRecords})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {taxon.occurrenceRecords.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                  context={context}
                />
              ),
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad} relay={relay} />
      </>
    );
    if (wrapperTitle) {
      return (
        <div>
          <i>{wrapperTitle}</i>
          {inner}
        </div>
      );
    }
    return inner;
  }
}

export default createPaginationContainer(
  TaxonOccurrenceRecords,
  {
    taxon: graphql`
      fragment TaxonOccurrenceRecords_taxon on Taxon
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numOccurrenceRecords
        occurrenceRecords(first: $count, after: $cursor)
          @connection(key: "TaxonOccurrenceRecords_occurrenceRecords") {
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
    getConnectionFromProps: (props) => props.taxon.occurrenceRecords,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.taxon.oid,
      };
    },
    query: graphql`
      query TaxonOccurrenceRecordsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        taxon(oid: $oid) {
          ...TaxonOccurrenceRecords_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
