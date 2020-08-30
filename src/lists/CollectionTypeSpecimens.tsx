import * as React from "react";

import { CollectionTypeSpecimens_collection } from "./__generated__/CollectionTypeSpecimens_collection.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface CollectionTypeSpecimensProps {
  collection: CollectionTypeSpecimens_collection;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class CollectionTypeSpecimens extends React.Component<
  CollectionTypeSpecimensProps
> {
  render() {
    const { collection, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !collection.typeSpecimens ||
      collection.typeSpecimens.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "TypeSpecimens"}</h3>}
        <NameList connection={collection.typeSpecimens} />
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
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
