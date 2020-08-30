import * as React from "react";

import { PeriodLocationsMax_period } from "./__generated__/PeriodLocationsMax_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface PeriodLocationsMaxProps {
  period: PeriodLocationsMax_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodLocationsMax extends React.Component<PeriodLocationsMaxProps> {
  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    if (!period.locationsMax || period.locationsMax.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "LocationsMax"}</h3>}
        <ul>
          {period.locationsMax.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  PeriodLocationsMax,
  {
    period: graphql`
      fragment PeriodLocationsMax_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        locationsMax(first: $count, after: $cursor)
          @connection(key: "PeriodLocationsMax_locationsMax") {
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
    getConnectionFromProps: (props) => props.period.locationsMax,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsMaxPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodLocationsMax_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
