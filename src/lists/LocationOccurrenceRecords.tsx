import * as React from "react";

import { LocationOccurrenceRecords_location } from "./__generated__/LocationOccurrenceRecords_location.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface LocationOccurrenceRecordsProps {
  location: LocationOccurrenceRecords_location;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class LocationOccurrenceRecords extends React.Component<
  LocationOccurrenceRecordsProps,
  { expandAll: boolean }
> {
  constructor(props: LocationOccurrenceRecordsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { location, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Location";
    if (!location.occurrenceRecords || location.occurrenceRecords.edges.length === 0) {
      return null;
    }
    const showExpandAll = location.occurrenceRecords.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Occurrence records"} ({location.numOccurrenceRecords})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {location.occurrenceRecords.edges.map(
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
  LocationOccurrenceRecords,
  {
    location: graphql`
      fragment LocationOccurrenceRecords_location on Location
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numOccurrenceRecords
        occurrenceRecords(first: $count, after: $cursor)
          @connection(key: "LocationOccurrenceRecords_occurrenceRecords") {
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
    getConnectionFromProps: (props) => props.location.occurrenceRecords,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.location.oid,
      };
    },
    query: graphql`
      query LocationOccurrenceRecordsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        location(oid: $oid) {
          ...LocationOccurrenceRecords_location
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
