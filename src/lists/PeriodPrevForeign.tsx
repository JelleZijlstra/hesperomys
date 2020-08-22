import * as React from "react";

import { PeriodPrevForeign_period } from "./__generated__/PeriodPrevForeign_period.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface PeriodPrevForeignProps {
  period: PeriodPrevForeign_period;
  title?: string;
  relay: RelayPaginationProp;
}

class PeriodPrevForeign extends React.Component<
  PeriodPrevForeignProps,
  { numToLoad: number }
> {
  constructor(props: PeriodPrevForeignProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { period, relay, title } = this.props;
    if (!period.prevForeign || period.prevForeign.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "PrevForeign"}</h3>
        <ul>
          {period.prevForeign.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <li key={edge.node.oid}>
                  <ModelLink model={edge.node} />
                </li>
              )
          )}
        </ul>
        {relay.hasMore() && (
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  this.setState({ numToLoad: parseInt(e.target.value) });
                }
              }}
            />
            {" More"}
          </div>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(this.state.numToLoad, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

export default createPaginationContainer(
  PeriodPrevForeign,
  {
    period: graphql`
      fragment PeriodPrevForeign_period on Period
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        prevForeign(first: $count, after: $cursor)
          @connection(key: "PeriodPrevForeign_prevForeign") {
          edges {
            node {
              oid
              ...ModelLink_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.period.prevForeign,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.period.oid,
      };
    },
    query: graphql`
      query PeriodPrevForeignPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        period(oid: $oid) {
          ...PeriodPrevForeign_period @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
