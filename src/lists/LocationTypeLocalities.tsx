import * as React from "react";

import { LocationTypeLocalities_location } from "./__generated__/LocationTypeLocalities_location.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface LocationTypeLocalitiesProps {
  location: LocationTypeLocalities_location;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class LocationTypeLocalities extends React.Component<
  LocationTypeLocalitiesProps
> {
  render() {
    const { location, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !location.typeLocalities ||
      location.typeLocalities.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "TypeLocalities"}</h3>}
        <NameList connection={location.typeLocalities} />
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  LocationTypeLocalities,
  {
    location: graphql`
      fragment LocationTypeLocalities_location on Location
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        typeLocalities(first: $count, after: $cursor)
          @connection(key: "LocationTypeLocalities_typeLocalities") {
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
    getConnectionFromProps: (props) => props.location.typeLocalities,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.location.oid,
      };
    },
    query: graphql`
      query LocationTypeLocalitiesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        location(oid: $oid) {
          ...LocationTypeLocalities_location
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
