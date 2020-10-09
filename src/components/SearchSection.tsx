import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import { SearchSectionQuery } from "./__generated__/SearchSectionQuery.graphql";

import SearchBox from "./SearchBox";
import Table from "./Table";

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
          stratigraphicUnitCls: modelCls(callSign: "S") {
            ...SearchBox_modelCls
          }
          citationGroupCls: modelCls(callSign: "CG") {
            ...SearchBox_modelCls
          }
          nameComplexCls: modelCls(callSign: "NC") {
            ...SearchBox_modelCls
          }
          speciesNameComplexCls: modelCls(callSign: "SC") {
            ...SearchBox_modelCls
          }
          personCls: modelCls(callSign: "H") {
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
        const data: [JSX.Element, JSX.Element][] = [
          [
            <Link to="/docs/taxon">Taxon</Link>,
            <SearchBox modelCls={props.taxonCls} />,
          ],
          [
            <Link to="/docs/name">Name</Link>,
            <SearchBox modelCls={props.nameCls} />,
          ],
          [
            <Link to="/docs/collection">Collection</Link>,
            <SearchBox modelCls={props.collectionCls} />,
          ],
          [
            <Link to="/docs/region">Region</Link>,
            <SearchBox modelCls={props.regionCls} />,
          ],
          [
            <Link to="/docs/location">Location</Link>,
            <SearchBox modelCls={props.locationCls} />,
          ],
          [
            <Link to="/docs/period">Period</Link>,
            <SearchBox modelCls={props.periodCls} />,
          ],
          [
            <Link to="/docs/stratigraphic-unit">Stratigraphic unit</Link>,
            <SearchBox modelCls={props.stratigraphicUnitCls} />,
          ],
          [
            <Link to="/docs/citation-group">Citation group</Link>,
            <SearchBox modelCls={props.citationGroupCls} />,
          ],
          [
            <Link to="/docs/name-complex">Name complex</Link>,
            <SearchBox modelCls={props.nameComplexCls} />,
          ],
          [
            <Link to="/docs/species-name-complex">Species name complex</Link>,
            <SearchBox modelCls={props.speciesNameComplexCls} />,
          ],
          [
            <Link to="/docs/person">Person</Link>,
            <SearchBox modelCls={props.personCls} />,
          ],
        ];
        return (
          <>
            <h2>Search</h2>
            <Table data={data} />
          </>
        );
      }}
    />
  );
}
