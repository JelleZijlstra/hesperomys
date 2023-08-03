import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import { SearchSectionQuery } from "./__generated__/SearchSectionQuery.graphql";

import SearchBox from "./SearchBox";
import Table from "./Table";
import { SearchBox_modelCls$key } from "./__generated__/SearchBox_modelCls.graphql";

function buildRow(
  name: string,
  link: string,
  callSign: string,
  modelCls: SearchBox_modelCls$key,
): [JSX.Element, JSX.Element] {
  return [
    <>
      <Link to={`/docs/${link}`}>{name}</Link>{" "}
      <small>
        (<Link to={`/new/${callSign}`}>new</Link>)
      </small>
    </>,
    <SearchBox modelCls={modelCls} />,
  ];
}

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
          buildRow("Taxon", "taxon", "T", props.taxonCls),
          buildRow("Name", "name", "N", props.nameCls),
          buildRow("Collection", "collection", "C", props.collectionCls),
          buildRow("Region", "region", "R", props.regionCls),
          buildRow("Location", "location", "L", props.locationCls),
          buildRow("Period", "period", "P", props.periodCls),
          buildRow(
            "Stratigraphic unit",
            "stratigraphic-unit",
            "S",
            props.stratigraphicUnitCls,
          ),
          buildRow("Citation group", "citation-group", "CG", props.citationGroupCls),
          buildRow("Name complex", "name-complex", "NC", props.nameComplexCls),
          buildRow(
            "Species name complex",
            "species-name-complex",
            "SC",
            props.speciesNameComplexCls,
          ),
          buildRow("Person", "person", "H", props.personCls),
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
