import * as React from "react";

import { LocationTaxa_location } from "./__generated__/LocationTaxa_location.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface LocationTaxaProps {
  location: LocationTaxa_location;
  title?: string;
  relay: RelayPaginationProp;
}

class LocationTaxa extends React.Component<
  LocationTaxaProps,
  { numToLoad: number }
> {
  constructor(props: LocationTaxaProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { location, relay, title } = this.props;
    if (!location.taxa || location.taxa.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Taxa"}</h3>
        <ul>
          {location.taxa.edges.map(
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
  LocationTaxa,
  {
    location: graphql`
      fragment LocationTaxa_location on Location
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        taxa(first: $count, after: $cursor)
          @connection(key: "LocationTaxa_taxa") {
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
    getConnectionFromProps: (props) => props.location.taxa,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.location.oid,
      };
    },
    query: graphql`
      query LocationTaxaPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        location(oid: $oid) {
          ...LocationTaxa_location @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
