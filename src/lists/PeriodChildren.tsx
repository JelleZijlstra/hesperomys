import * as React from "react";

import { PeriodChildren_period } from "./__generated__/PeriodChildren_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
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
  wrapperTitle?: string;
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
    const { period, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!period.children || period.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = period.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Children"} ({period.numChildren})
          </h3>
        )}
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
          {period.children.edges.map(
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

export default createPaginationContainer(
  PeriodChildren,
  {
    period: graphql`
      fragment PeriodChildren_period on Period
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
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
      query PeriodChildrenPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        period(oid: $oid) {
          ...PeriodChildren_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
