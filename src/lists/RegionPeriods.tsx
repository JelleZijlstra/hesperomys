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
import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "../components/ModelLink";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface RegionPeriodsProps {
  region: RegionPeriods_region;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  hideChildren?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
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
    const {
      region,
      relay,
      numToLoad,
      hideTitle,
      hideChildren,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const { oid, numChildren, periods } = region;
    if (!periods || (numChildren === 0 && periods.edges.length === 0)) {
      return null;
    }
    const showExpandAll = periods.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Periods"} ({numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
          showChildren={this.state.showChildren}
          setShowChildren={
            numChildren > 0 && !hideChildren
              ? (showChildren) => this.setState({ showChildren })
              : undefined
          }
        />
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
                          <RegionPeriodsContainer region={edge.node} hideTitle />
                        </li>
                      ),
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

const RegionPeriodsContainer = createPaginationContainer(
  RegionPeriods,
  {
    region: graphql`
      fragment RegionPeriods_region on Region
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        periods(first: $count, after: $cursor)
          @connection(key: "RegionPeriods_periods") {
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
    getConnectionFromProps: (props) => props.region.periods,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionPeriodsPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        region(oid: $oid) {
          ...RegionPeriods_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);

export default RegionPeriodsContainer;
