import React from 'react';
import {QueryRenderer} from 'react-relay';
import environment from "../relayEnvironment";
import {
  useParams
} from "react-router-dom";
import graphql from 'babel-plugin-relay/macro';

import { NameQuery } from "./__generated__/NameQuery.graphql";

export default function Name() {
  	const { id } = useParams();
    return (
      <QueryRenderer<NameQuery>
        environment={environment}
        query={graphql`
          query NameQuery($oid: Int!) {
            name(oid: $oid) {
              id
              correctedOriginalName
            }
          }
        `}
        variables={{oid: id}}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props || !props.name) {
            return <div>Loading...</div>;
          }
          return <div>User ID: {props.name.correctedOriginalName}</div>;
        }}
      />
    );
}