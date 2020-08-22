import * as React from "react";

import { RegionPeriods_region } from "./__generated__/RegionPeriods_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface RegionPeriodsProps {
  region: RegionPeriods_region;
  title?: string;
  relay: RelayPaginationProp;
}

class RegionPeriods extends React.Component<
  RegionPeriodsProps,
  { numToLoad: number }
> {
  constructor(props: RegionPeriodsProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { region, relay, title } = this.props;
    if (!region.periods || region.periods.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Periods"}</h3>
        <ul>
          {region.periods.edges.map(
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
  RegionPeriods,
  {
    region: graphql`
      fragment RegionPeriods_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        periods(first: $count, after: $cursor)
          @connection(key: "RegionPeriods_periods") {
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
    getConnectionFromProps: (props) => props.region.periods,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionPeriodsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionPeriods_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
