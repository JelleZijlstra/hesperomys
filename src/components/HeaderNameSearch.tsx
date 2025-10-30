import React from "react";
import { QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import environment from "../relayEnvironment";
import SearchBox from "./SearchBox";

import { HeaderNameSearchQuery } from "./__generated__/HeaderNameSearchQuery.graphql";

export default function HeaderNameSearch() {
  return (
    <QueryRenderer<HeaderNameSearchQuery>
      environment={environment}
      query={graphql`
        query HeaderNameSearchQuery {
          nameCls: modelCls(callSign: "N") {
            ...SearchBox_modelCls
          }
        }
      `}
      variables={{}}
      render={({ error, props }) => {
        if (error || !props || !props.nameCls) {
          return null;
        }
        return (
          <div className="header-name-search">
            <SearchBox modelCls={props.nameCls} placeholder="Search names" />
          </div>
        );
      }}
    />
  );
}
