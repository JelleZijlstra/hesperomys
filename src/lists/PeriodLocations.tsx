import * as React from "react";

import { PeriodLocations_period } from "./__generated__/PeriodLocations_period.graphql";
import { PeriodLocationsChildrenQuery } from "./__generated__/PeriodLocationsChildrenQuery.graphql";

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
import { Context } from "../components/ModelLink";

interface PeriodLocationsProps {
  period: PeriodLocations_period;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  hideChildren?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class PeriodLocations extends React.Component<
  PeriodLocationsProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: PeriodLocationsProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const {
      period,
      relay,
      numToLoad,
      hideTitle,
      hideChildren,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const context = this.props.context || "Period";
    const { oid, numChildren, chilrenPeriodLocations, locations } = period;
    const childrenHaveData = chilrenPeriodLocations?.edges.some(
      (edge) => edge && edge.node && edge.node.hasLocations,
    );
    if (!locations || (!childrenHaveData && locations.edges.length === 0)) {
      return null;
    }
    const showExpandAll = locations.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && <h3>{title || "Locations"}</h3>}
        {subtitle}
        {childrenHaveData && (
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
        )}
        {this.state.showChildren && (
          <QueryRenderer<PeriodLocationsChildrenQuery>
            environment={environment}
            query={graphql`
              query PeriodLocationsChildrenQuery($oid: Int!) {
                period(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasLocations
                        ...PeriodLocations_period
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
                      edge.node.hasLocations && (
                        <li>
                          <ModelLink model={edge.node} context={context} />
                          <PeriodLocationsContainer
                            period={edge.node}
                            hideTitle
                            context={context}
                          />
                        </li>
                      ),
                  )}
                </ul>
              );
            }}
          />
        )}
        <ul>
          {locations.edges.map(
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

const PeriodLocationsContainer = createPaginationContainer(
  PeriodLocations,
  {
    period: graphql`
      fragment PeriodLocations_period on Period
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        chilrenPeriodLocations: children(first: 1000) {
          edges {
            node {
              hasLocations
            }
          }
        }
        locations(first: $count, after: $cursor)
          @connection(key: "PeriodLocations_locations") {
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
    getConnectionFromProps: (props) => props.period.locations,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        period(oid: $oid) {
          ...PeriodLocations_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);

export default PeriodLocationsContainer;
