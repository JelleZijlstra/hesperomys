import * as React from "react";

import { PeriodNextForeign_period } from "./__generated__/PeriodNextForeign_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PeriodNextForeignProps {
  period: PeriodNextForeign_period;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodNextForeign extends React.Component<
  PeriodNextForeignProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodNextForeignProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!period.nextForeign || period.nextForeign.edges.length === 0) {
      return null;
    }
    const showExpandAll = period.nextForeign.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "NextForeign"}</h3>}
        {subtitle}
        <ul>
          {period.nextForeign.edges.map(
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
  PeriodNextForeign,
  {
    period: graphql`
      fragment PeriodNextForeign_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        nextForeign(first: $count, after: $cursor)
          @connection(key: "PeriodNextForeign_nextForeign") {
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
    getConnectionFromProps: (props) => props.period.nextForeign,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodNextForeignPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodNextForeign_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
