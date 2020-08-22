import * as React from "react";

import { CollectionTypeSpecimens_collection } from "./__generated__/CollectionTypeSpecimens_collection.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface CollectionTypeSpecimensProps {
  collection: CollectionTypeSpecimens_collection;
  title?: string;
  relay: RelayPaginationProp;
}

class CollectionTypeSpecimens extends React.Component<
  CollectionTypeSpecimensProps,
  { numToLoad: number | null }
> {
  constructor(props: CollectionTypeSpecimensProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { collection, relay, title } = this.props;
    if (
      !collection.typeSpecimens ||
      collection.typeSpecimens.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "TypeSpecimens"}</h3>
        <NameList connection={collection.typeSpecimens} />
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
  CollectionTypeSpecimens,
  {
    collection: graphql`
      fragment CollectionTypeSpecimens_collection on Collection
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        typeSpecimens(first: $count, after: $cursor)
          @connection(key: "CollectionTypeSpecimens_typeSpecimens") {
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
    getConnectionFromProps: (props) => props.collection.typeSpecimens,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.collection.oid,
      };
    },
    query: graphql`
      query CollectionTypeSpecimensPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        collection(oid: $oid) {
          ...CollectionTypeSpecimens_collection
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
