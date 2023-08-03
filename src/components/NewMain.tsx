import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import { useParams } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";

import { NewMainQuery } from "./__generated__/NewMainQuery.graphql";

import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import NewList from "./NewList";

export default function NewMain() {
  const { callSign } = useParams();
  return (
    <QueryRenderer<NewMainQuery>
      environment={environment}
      query={graphql`
        query NewMainQuery($callSign: String!) {
          modelCls(callSign: $callSign) {
            name
            ...NewList_modelCls
          }
        }
      `}
      variables={{ callSign }}
      render={({ error, props }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        return (
          <>
            <SiteHeader>
              <>New objects: {props.modelCls.name}</>
            </SiteHeader>
            <SiteBody>
              <p>
                This page list objects that were most recently added to the database.
              </p>
              <NewList modelCls={props.modelCls} />
            </SiteBody>
          </>
        );
      }}
    />
  );
}
