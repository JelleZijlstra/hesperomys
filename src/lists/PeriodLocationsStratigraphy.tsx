import * as React from "react";

import { PeriodLocationsStratigraphy_period } from "./__generated__/PeriodLocationsStratigraphy_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface PeriodLocationsStratigraphyProps {
  period: PeriodLocationsStratigraphy_period;
  title?: string;
  relay: RelayPaginationProp;
}

class PeriodLocationsStratigraphy extends React.Component<
  PeriodLocationsStratigraphyProps,
  { numToLoad: number }
> {
  constructor(props: PeriodLocationsStratigraphyProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { period, relay, title } = this.props;
    if (
      !period.locationsStratigraphy ||
      period.locationsStratigraphy.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "LocationsStratigraphy"}</h3>
        <ul>
          {period.locationsStratigraphy.edges.map(
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
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  this.setState({ numToLoad: parseInt(e.target.value) });
                }
              }}
            />
            {" More"}
          </div>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(this.state.numToLoad, (error) => {
      if (error) {
        console.log(error);
      }
    });
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
              ...ModelLink_model
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