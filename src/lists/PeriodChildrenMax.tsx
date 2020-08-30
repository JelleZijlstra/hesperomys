import * as React from "react";

import { PeriodChildrenMax_period } from "./__generated__/PeriodChildrenMax_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface PeriodChildrenMaxProps {
  period: PeriodChildrenMax_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodChildrenMax extends React.Component<PeriodChildrenMaxProps> {
  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    if (!period.childrenMax || period.childrenMax.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "ChildrenMax"}</h3>}
        <ul>
          {period.childrenMax.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  PeriodChildrenMax,
  {
    period: graphql`
      fragment PeriodChildrenMax_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        childrenMax(first: $count, after: $cursor)
          @connection(key: "PeriodChildrenMax_childrenMax") {
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
    getConnectionFromProps: (props) => props.period.childrenMax,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodChildrenMaxPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodChildrenMax_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
