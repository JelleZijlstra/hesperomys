import * as React from "react";

import { PeriodLocationsMax_period } from "./__generated__/PeriodLocationsMax_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PeriodLocationsMaxProps {
  period: PeriodLocationsMax_period;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class PeriodLocationsMax extends React.Component<
  PeriodLocationsMaxProps,
  { expandAll: boolean }
> {
  constructor(props: PeriodLocationsMaxProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { period, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!period.locationsMax || period.locationsMax.edges.length === 0) {
      return null;
    }
    const showExpandAll = period.locationsMax.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "LocationsMax"} ({period.numLocationsMax})
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
          {period.locationsMax.edges.map(
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
  PeriodLocationsMax,
  {
    period: graphql`
      fragment PeriodLocationsMax_period on Period
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numLocationsMax
        locationsMax(first: $count, after: $cursor)
          @connection(key: "PeriodLocationsMax_locationsMax") {
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
    getConnectionFromProps: (props) => props.period.locationsMax,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodLocationsMaxPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodLocationsMax_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
