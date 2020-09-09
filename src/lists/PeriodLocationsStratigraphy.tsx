import * as React from "react";

import { PeriodLocationsStratigraphy_period } from "./__generated__/PeriodLocationsStratigraphy_period.graphql";
import { PeriodLocationsStratigraphyChildrenQuery } from "./__generated__/PeriodLocationsStratigraphyChildrenQuery.graphql";

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
import { supportsChildren } from "../components/ModelChildList";

interface PeriodLocationsStratigraphyProps {
  period: PeriodLocationsStratigraphy_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodLocationsStratigraphy extends React.Component<
  PeriodLocationsStratigraphyProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: PeriodLocationsStratigraphyProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    const { oid, numChildren, locationsStratigraphy } = period;
    if (
      !locationsStratigraphy ||
      (numChildren === 0 && locationsStratigraphy.edges.length === 0)
    ) {
      return null;
    }
    const showExpandAll = locationsStratigraphy.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "LocationsStratigraphy"}</h3>}
        {this.state.showChildren && (
          <QueryRenderer<PeriodLocationsStratigraphyChildrenQuery>
            environment={environment}
            query={graphql`
              query PeriodLocationsStratigraphyChildrenQuery($oid: Int!) {
                period(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasLocationsStratigraphy
                        ...PeriodLocationsStratigraphy_period
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
              if (!props || !props.period || !props.period.children) {
                return <div>Loading...</div>;
              }
              const { edges } = props.period.children;
              return (
                <ul>
                  {edges.map(
                    (edge) =>
                      edge &&
                      edge.node &&
                      edge.node.hasLocationsStratigraphy && (
                        <li>
                          <ModelLink model={edge.node} />
                          <PeriodLocationsStratigraphyContainer
                            period={edge.node}
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
          {locationsStratigraphy.edges.map(
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
            showExpandAll
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

const PeriodLocationsStratigraphyContainer = createPaginationContainer(
  PeriodLocationsStratigraphy,
  {
    period: graphql`
      fragment PeriodLocationsStratigraphy_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        numChildren
        locationsStratigraphy(first: $count, after: $cursor)
          @connection(
            key: "PeriodLocationsStratigraphy_locationsStratigraphy"
          ) {
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

export default PeriodLocationsStratigraphyContainer;
