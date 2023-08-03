import * as React from "react";

import { NewList_modelCls } from "./__generated__/NewList_modelCls.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface NewListProps {
  modelCls: NewList_modelCls;
  relay: RelayPaginationProp;
}

function NewList({ modelCls, relay }: NewListProps) {
  return (
    <>
      <ul>
        {modelCls.newest.edges.map(
          (edge) =>
            edge &&
            edge.node && <ModelListEntry key={edge.node.oid} model={edge.node} />,
        )}
      </ul>
      <LoadMoreButton numToLoad={50} relay={relay} />
    </>
  );
}

export default createPaginationContainer(
  NewList,
  {
    modelCls: graphql`
      fragment NewList_modelCls on ModelCls
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        callSign
        newest(first: $count, after: $cursor) @connection(key: "NewList_newest") {
          edges {
            node {
              oid
              ...ModelListEntry_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.modelCls.newest,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        callSign: props.modelCls.callSign,
      };
    },
    query: graphql`
      query NewListPaginationQuery($count: Int!, $cursor: String, $callSign: String!) {
        modelCls(callSign: $callSign) {
          ...NewList_modelCls @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
