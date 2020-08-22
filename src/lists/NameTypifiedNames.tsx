import * as React from "react";

import { NameTypifiedNames_name } from "./__generated__/NameTypifiedNames_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface NameTypifiedNamesProps {
  name: NameTypifiedNames_name;
  title?: string;
  relay: RelayPaginationProp;
}

class NameTypifiedNames extends React.Component<
  NameTypifiedNamesProps,
  { numToLoad: number | null }
> {
  constructor(props: NameTypifiedNamesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { name, relay, title } = this.props;
    if (!name.typifiedNames || name.typifiedNames.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "TypifiedNames"}</h3>
        <NameList connection={name.typifiedNames} />
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
  NameTypifiedNames,
  {
    name: graphql`
      fragment NameTypifiedNames_name on Name
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        typifiedNames(first: $count, after: $cursor)
          @connection(key: "NameTypifiedNames_typifiedNames") {
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
    getConnectionFromProps: (props) => props.name.typifiedNames,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameTypifiedNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        name(oid: $oid) {
          ...NameTypifiedNames_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
