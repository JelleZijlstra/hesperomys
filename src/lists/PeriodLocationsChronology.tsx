import * as React from "react";

import { PeriodLocationsChronology_period } from "./__generated__/PeriodLocationsChronology_period.graphql";
import { PeriodLocationsChronologyChildrenQuery } from "./__generated__/PeriodLocationsChronologyChildrenQuery.graphql";

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

interface PeriodLocationsChronologyProps {
  period: PeriodLocationsChronology_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodLocationsChronology extends React.Component<
  PeriodLocationsChronologyProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: PeriodLocationsChronologyProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    const { oid, numChildren, locationsChronology } = period;
    if (
      !locationsChronology ||
      (numChildren === 0 && locationsChronology.edges.length === 0)
    ) {
      return null;
    }
    const showExpandAll = locationsChronology.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "LocationsChronology"}</h3>}
        {this.state.showChildren && (
          <QueryRenderer<PeriodLocationsChronologyChildrenQuery>
            environment={environment}
            query={graphql`
              query PeriodLocationsChronologyChildrenQuery($oid: Int!) {
                period(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasLocationsChronology
                        ...PeriodLocationsChronology_period
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
                      edge.node.hasLocationsChronology && (
                        <li>
                          <ModelLink model={edge.node} />
                          <PeriodLocationsChronologyContainer
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
          {locationsChronology.edges.map(
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

const PeriodLocationsChronologyContainer = createPaginationContainer(
  PeriodLocationsChronology,
  {
    period: graphql`
      fragment PeriodLocationsChronology_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        numChildren
        locationsChronology(first: $count, after: $cursor)
          @connection(key: "PeriodLocationsChronology_locationsChronology") {
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
    getConnectionFromProps: (props) => props.period.locationsChronology,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsChronologyPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodLocationsChronology_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);

export default PeriodLocationsChronologyContainer;
