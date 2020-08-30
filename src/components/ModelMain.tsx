import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import { useParams } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";

import { ModelMainQuery } from "./__generated__/ModelMainQuery.graphql";

import Title from "../title/Title";
import Subtitle from "../subtitle/Subtitle";
import SiteHeader from "./SiteHeader";
import Body from "../body/Body";
import ModelLink from "./ModelLink";

export default function ModelMain() {
  const { callSign, oid } = useParams();
  return (
    <QueryRenderer<ModelMainQuery>
      environment={environment}
      query={graphql`
        query ModelMainQuery($callSign: String!, $oid: String!) {
          models: byCallSign(callSign: $callSign, oid: $oid) {
            callSign
            oid
            ...Title_model
            ...Subtitle_model
            ...Body_model
            ...ModelLink_model
          }
        }
      `}
      variables={{ oid, callSign }}
      render={({ error, props }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        if (!props.models || props.models.length === 0) {
          return <div>Not found</div>;
        }
        if (props.models.length > 1) {
          return (
            <>
              <SiteHeader>
                <>
                  /{callSign}/{oid}
                </>
              </SiteHeader>
              <ul>
                {props.models.map(
                  (model) =>
                    model && (
                      <li key={model.oid}>
                        <ModelLink model={model} />
                      </li>
                    )
                )}
              </ul>
            </>
          );
        }
        const [model] = props.models;
        if (model === null) {
          return <div>Not found</div>;
        }
        return (
          <>
            <SiteHeader subtitle={<Subtitle model={model} />}>
              <>
                <Title model={model} /> ({model.callSign}#{model.oid})
              </>
            </SiteHeader>
            <Body model={model} />
          </>
        );
      }}
    />
  );
}
