import * as React from "react";

import { PeriodChildrenMin_period } from "./__generated__/PeriodChildrenMin_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PeriodChildrenMinProps {
  period: PeriodChildrenMin_period;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PeriodChildrenMin extends React.Component<
  PeriodChildrenMinProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodChildrenMinProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!period.childrenMin || period.childrenMin.edges.length === 0) {
      return null;
    }
    const showExpandAll = period.childrenMin.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "ChildrenMin"}</h3>}
        {subtitle}
        <ul>
          {period.childrenMin.edges.map(
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
