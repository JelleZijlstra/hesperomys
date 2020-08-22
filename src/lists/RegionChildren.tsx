import * as React from "react";

import { RegionChildren_region } from "./__generated__/RegionChildren_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface RegionChildrenProps {
  region: RegionChildren_region;
  title?: string;
  relay: RelayPaginationProp;
}

class RegionChildren extends React.Component<
  RegionChildrenProps,
  { numToLoad: number }
> {
  constructor(props: RegionChildrenProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { region, relay, title } = this.props;
    if (!region.children || region.children.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Children"}</h3>
        <ul>
          {region.children.edges.map(
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
  RegionChildren,
  {
    region: graphql`
      fragment RegionChildren_region on Region
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "RegionChildren_children") {
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
    getConnectionFromProps: (props) => props.region.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionChildren_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
