import * as React from "react";

import { PeriodStratigraphicUnitsMax_period } from "./__generated__/PeriodStratigraphicUnitsMax_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PeriodStratigraphicUnitsMaxProps {
  period: PeriodStratigraphicUnitsMax_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodStratigraphicUnitsMax extends React.Component<
  PeriodStratigraphicUnitsMaxProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodStratigraphicUnitsMaxProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !period.stratigraphicUnitsMax ||
      period.stratigraphicUnitsMax.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = period.stratigraphicUnitsMax.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "StratigraphicUnitsMax"}</h3>}
        <ul>
          {period.stratigraphicUnitsMax.edges.map(
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
        />
      </>
    );
  }
}

export default createPaginationContainer(
  PeriodStratigraphicUnitsMax,
  {
    period: graphql`
      fragment PeriodStratigraphicUnitsMax_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        stratigraphicUnitsMax(first: $count, after: $cursor)
          @connection(
            key: "PeriodStratigraphicUnitsMax_stratigraphicUnitsMax"
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
    getConnectionFromProps: (props) => props.period.stratigraphicUnitsMax,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodStratigraphicUnitsMaxPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodStratigraphicUnitsMax_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
