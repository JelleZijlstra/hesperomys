import * as React from "react";

import { PeriodChildren_period } from "./__generated__/PeriodChildren_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PeriodChildrenProps {
  period: PeriodChildren_period;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodChildren extends React.Component<
  PeriodChildrenProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodChildrenProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!period.children || period.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = period.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Children"}</h3>}
        {subtitle}
        <ul>
          {period.children.edges.map(
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
  PeriodChildren,
  {
    period: graphql`
      fragment PeriodChildren_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "PeriodChildren_children") {
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
    getConnectionFromProps: (props) => props.period.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodChildren_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
