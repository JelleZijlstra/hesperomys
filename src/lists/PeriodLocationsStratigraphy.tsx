import * as React from "react";

import { PeriodLocationsStratigraphy_period } from "./__generated__/PeriodLocationsStratigraphy_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface PeriodLocationsStratigraphyProps {
  period: PeriodLocationsStratigraphy_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodLocationsStratigraphy extends React.Component<
  PeriodLocationsStratigraphyProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodLocationsStratigraphyProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !period.locationsStratigraphy ||
      period.locationsStratigraphy.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "LocationsStratigraphy"}</h3>}
        <ul>
          {period.locationsStratigraphy.edges.map(
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
  PeriodLocationsStratigraphy,
  {
    period: graphql`
      fragment PeriodLocationsStratigraphy_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        locationsStratigraphy(first: $count, after: $cursor)
          @connection(
            key: "PeriodLocationsStratigraphy_locationsStratigraphy"
          ) {
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
    getConnectionFromProps: (props) => props.period.locationsStratigraphy,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsStratigraphyPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodLocationsStratigraphy_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
