import * as React from "react";

import { RegionPeriods_region } from "./__generated__/RegionPeriods_region.graphql";
import { RegionPeriodsChildrenQuery } from "./__generated__/RegionPeriodsChildrenQuery.graphql";

import {
  createPaginationContainer,
  RelayPaginationProp,
  QueryRenderer,
} from "react-relay";
import graphql from "babel-plugin-relay/macro";

import environment from "../relayEnvironment";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "../components/ModelLink";
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
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: RegionPeriodsProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title } = this.props;
    const { oid, numChildren, periods } = region;
    if (!periods || (numChildren === 0 && periods.edges.length === 0)) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Periods"}</h3>}
        {this.state.showChildren && (
          <QueryRenderer<RegionPeriodsChildrenQuery>
            environment={environment}
            query={graphql`
              query RegionPeriodsChildrenQuery($oid: Int!) {
                region(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasPeriods
                        ...RegionPeriods_region
                        ...ModelLink_model
                      }
                    }
                  }
                }
              }
            `}
            variables={{ oid }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.region || !props.region.children) {
                return <div>Loading...</div>;
              }
              const { edges } = props.region.children;
              return (
                <ul>
                  {edges.map(
                    (edge) =>
                      edge &&
                      edge.node &&
                      edge.node.hasPeriods && (
                        <li>
                          <ModelLink model={edge.node} />
                          <RegionPeriodsContainer
                            region={edge.node}
                            hideTitle
                          />
                        </li>
                      )
                  )}
                </ul>
              );
            }}
          />
        )}
        <ul>
          {periods.edges.map(
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
          numToLoad={numToLoad || 100}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={
            periods.edges.length > 0
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
          showChildren={this.state.showChildren}
          setShowChildren={
            numChildren > 0
              ? (showChildren) => this.setState({ showChildren })
              : undefined
          }
        />
      </>
    );
  }
}

const RegionPeriodsContainer = createPaginationContainer(
  RegionPeriods,
  {
    region: graphql`
      fragment RegionPeriods_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        numChildren
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

export default RegionPeriodsContainer;
