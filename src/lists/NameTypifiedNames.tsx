import * as React from "react";

import { NameTypifiedNames_name } from "./__generated__/NameTypifiedNames_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface NameTypifiedNamesProps {
  name: NameTypifiedNames_name;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class NameTypifiedNames extends React.Component<NameTypifiedNamesProps> {
  render() {
    const { name, relay, numToLoad, hideTitle, title } = this.props;
    if (!name.typifiedNames || name.typifiedNames.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "TypifiedNames"}</h3>}
        <NameList connection={name.typifiedNames} />
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
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
