import * as React from "react";

import { RegionPeriods_region } from "./__generated__/RegionPeriods_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface RegionPeriodsProps {
  region: RegionPeriods_region;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class RegionPeriods extends React.Component<
  RegionPeriodsProps,
  { expandAll: boolean }
> {
  constructor(props: RegionPeriodsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    if (!region.periods || region.periods.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Periods"}</h3>}
        <ul>
          {region.periods.edges.map(
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
              ...ModelListEntry_model
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
