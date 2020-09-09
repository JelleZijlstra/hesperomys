import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";

import { HomeMainQuery } from "./__generated__/HomeMainQuery.graphql";

import SiteHeader from "./SiteHeader";
import SearchBox from "./SearchBox";

export default function HomeMain() {
  return (
    <QueryRenderer<HomeMainQuery>
      environment={environment}
      query={graphql`
        query HomeMainQuery {
          taxonCls: modelCls(callSign: "T") {
            ...SearchBox_modelCls
          }
          nameCls: modelCls(callSign: "N") {
            ...SearchBox_modelCls
          }
          collectionCls: modelCls(callSign: "C") {
            ...SearchBox_modelCls
          }
          regionCls: modelCls(callSign: "R") {
            ...SearchBox_modelCls
          }
          locationCls: modelCls(callSign: "L") {
            ...SearchBox_modelCls
          }
          periodCls: modelCls(callSign: "P") {
            ...SearchBox_modelCls
          }
        }
      `}
      variables={{}}
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
              <>Home</>
            </SiteHeader>
            <SearchBox modelCls={props.taxonCls} />
            <SearchBox modelCls={props.nameCls} />
            <SearchBox modelCls={props.collectionCls} />
            <SearchBox modelCls={props.regionCls} />
            <SearchBox modelCls={props.locationCls} />
            <SearchBox modelCls={props.periodCls} />
          </>
        );
      }}
    />
  );
}
