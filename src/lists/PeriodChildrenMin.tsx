import * as React from "react";

import { PeriodChildrenMin_period } from "./__generated__/PeriodChildrenMin_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface PeriodChildrenMinProps {
  period: PeriodChildrenMin_period;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodChildrenMin extends React.Component<PeriodChildrenMinProps> {
  render() {
    const { period, relay, numToLoad, hideTitle, title } = this.props;
    if (!period.childrenMin || period.childrenMin.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "ChildrenMin"}</h3>}
        <ul>
          {period.childrenMin.edges.map(
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
  PeriodChildrenMin,
  {
    period: graphql`
      fragment PeriodChildrenMin_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        childrenMin(first: $count, after: $cursor)
          @connection(key: "PeriodChildrenMin_childrenMin") {
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
    getConnectionFromProps: (props) => props.period.childrenMin,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodChildrenMinPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodChildrenMin_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
