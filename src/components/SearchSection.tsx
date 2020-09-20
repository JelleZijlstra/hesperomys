import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";

import { SearchSectionQuery } from "./__generated__/SearchSectionQuery.graphql";

import SearchBox from "./SearchBox";

export default function SearchSection() {
  return (
    <QueryRenderer<SearchSectionQuery>
      environment={environment}
      query={graphql`
        query SearchSectionQuery {
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
