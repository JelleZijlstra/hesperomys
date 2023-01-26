import * as React from "react";

import { PeriodStratigraphicUnitsMin_period } from "./__generated__/PeriodStratigraphicUnitsMin_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PeriodStratigraphicUnitsMinProps {
  period: PeriodStratigraphicUnitsMin_period;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodStratigraphicUnitsMin extends React.Component<
  PeriodStratigraphicUnitsMinProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodStratigraphicUnitsMinProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (
      !period.stratigraphicUnitsMin ||
      period.stratigraphicUnitsMin.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = period.stratigraphicUnitsMin.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "StratigraphicUnitsMin"}</h3>}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
        />
        <ul>
          {period.stratigraphicUnitsMin.edges.map(
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
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  PeriodStratigraphicUnitsMin,
  {
    period: graphql`
      fragment PeriodStratigraphicUnitsMin_period on Period
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        stratigraphicUnitsMin(first: $count, after: $cursor)
          @connection(key: "PeriodStratigraphicUnitsMin_stratigraphicUnitsMin") {
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
    getConnectionFromProps: (props) => props.period.stratigraphicUnitsMin,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodStratigraphicUnitsMinPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodStratigraphicUnitsMin_period
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
