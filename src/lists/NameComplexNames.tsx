import * as React from "react";

import { NameComplexNames_nameComplex } from "./__generated__/NameComplexNames_nameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface NameComplexNamesProps {
  nameComplex: NameComplexNames_nameComplex;
  title?: string;
  relay: RelayPaginationProp;
}

class NameComplexNames extends React.Component<
  NameComplexNamesProps,
  { numToLoad: number | null }
> {
  constructor(props: NameComplexNamesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { nameComplex, relay, title } = this.props;
    if (!nameComplex.names || nameComplex.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Names"}</h3>
        <NameList connection={nameComplex.names} />
        {relay.hasMore() && (
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad || ""}
              onChange={(e) => {
                if (!e.target.value) {
                  this.setState({ numToLoad: null });
                  return;
                }
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

    relay.loadMore(this.state.numToLoad || 10, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

export default createPaginationContainer(
  NameComplexNames,
  {
    nameComplex: graphql`
      fragment NameComplexNames_nameComplex on NameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "NameComplexNames_names") {
          edges {
            node {
              oid
            }
          }
          ...NameList_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.nameComplex.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.nameComplex.oid,
      };
    },
    query: graphql`
      query NameComplexNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        nameComplex(oid: $oid) {
          ...NameComplexNames_nameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
