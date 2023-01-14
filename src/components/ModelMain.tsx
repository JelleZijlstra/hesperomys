import React, { useEffect } from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import { useParams } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";

import { ModelMainQuery } from "./__generated__/ModelMainQuery.graphql";

import PageTitle from "./PageTitle";
import Subtitle from "../subtitle/Subtitle";
import SiteHeader from "./SiteHeader";
import Body from "../body/Body";
import ModelLink from "./ModelLink";
import SiteBody from "./SiteBody";

const MultiModel = function ({
  models,
  callSign,
  oid,
}: {
  models: NonNullable<ModelMainQuery["response"]["models"]>;
  callSign: string;
  oid: string;
}) {
  useEffect(() => {
    document.title = `/${callSign}/${oid}`;
  }, [callSign, oid]);
  return (
    <>
      <SiteHeader>
        <>
          /{callSign}/{oid}
        </>
      </SiteHeader>
      <ul>
        {models.map(
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
};

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
            redirectUrl
            ...PageTitle_model
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
            <MultiModel models={props.models} callSign={callSign} oid={oid} />
          );
        }
        const [model] = props.models;
        if (model === null) {
          return <div>Not found</div>;
        }
        if (model.redirectUrl) {
          window.location.assign(`${model.redirectUrl}${window.location.search}`);
          return <div>Redirecting to <a href={model.redirectUrl}>model.redirecturl</a>...</div>;
        }
        const canonicalUrl = `/${model.callSign.toLowerCase()}/${model.oid}${
          window.location.search
        }`;
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", canonicalUrl);
        }
        return (
          <>
            <SiteHeader subtitle={<Subtitle model={model} />}>
              <PageTitle model={model} />
            </SiteHeader>
            <SiteBody>
              <Body model={model} />
            </SiteBody>
          </>
        );
      }}
    />
  );
}
