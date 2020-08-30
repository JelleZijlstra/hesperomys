import * as React from "react";

import { PeriodLocationsMin_period } from "./__generated__/PeriodLocationsMin_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface PeriodLocationsMinProps {
  period: PeriodLocationsMin_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodLocationsMin extends React.Component<
  PeriodLocationsMinProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodLocationsMinProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    if (!period.locationsMin || period.locationsMin.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "LocationsMin"}</h3>}
        <ul>
          {period.locationsMin.edges.map(
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
          setExpandAll={(expandAll: boolean) => this.setState({ expandAll })}
        />
      </>
    );
  }
}

export default createPaginationContainer(
  PeriodLocationsMin,
  {
    period: graphql`
      fragment PeriodLocationsMin_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        locationsMin(first: $count, after: $cursor)
          @connection(key: "PeriodLocationsMin_locationsMin") {
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
    getConnectionFromProps: (props) => props.period.locationsMin,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsMinPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodLocationsMin_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
