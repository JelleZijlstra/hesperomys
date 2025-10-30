import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import { SearchSectionQuery } from "./__generated__/SearchSectionQuery.graphql";

import SearchBox from "./SearchBox";
import { SearchBox_modelCls$key } from "./__generated__/SearchBox_modelCls.graphql";

function SearchCard({
  name,
  link,
  callSign,
  modelCls,
  placeholder,
}: {
  name: string;
  link: string;
  callSign: string;
  modelCls: SearchBox_modelCls$key;
  placeholder?: string;
}) {
  return (
    <div className={`search-card`}>
      <div className="search-card-header">
        <Link to={`/docs/${link}`}>{name}</Link>{" "}
        <small>
          (<Link to={`/new/${callSign}`}>new</Link>)
        </small>
      </div>
      <div className="search-card-body">
        <SearchBox modelCls={modelCls} placeholder={placeholder} />
      </div>
    </div>
  );
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
          classificationEntryCls: modelCls(callSign: "CE") {
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
        const cards = [
          { n: "Taxon", l: "taxon", c: "T", m: props.taxonCls },
          { n: "Collection", l: "collection", c: "C", m: props.collectionCls },
          { n: "Region", l: "region", c: "R", m: props.regionCls },
          { n: "Location", l: "location", c: "L", m: props.locationCls },
          { n: "Period", l: "period", c: "P", m: props.periodCls },
          {
            n: "Stratigraphic unit",
            l: "stratigraphic-unit",
            c: "S",
            m: props.stratigraphicUnitCls,
          },
          {
            n: "Citation group",
            l: "citation-group",
            c: "CG",
            m: props.citationGroupCls,
          },
          { n: "Name complex", l: "name-complex", c: "NC", m: props.nameComplexCls },
          {
            n: "Species name complex",
            l: "species-name-complex",
            c: "SC",
            m: props.speciesNameComplexCls,
          },
          { n: "Person", l: "person", c: "H", m: props.personCls },
          {
            n: "Classification entry",
            l: "classification-entry",
            c: "CE",
            m: props.classificationEntryCls,
          },
        ];
        return (
          <>
            <div className="hero-search">
              <div className="hero-title">Search names</div>
              <SearchBox
                modelCls={props.nameCls}
                placeholder="Search names (e.g., Mus musculus)"
              />
            </div>
            <div className="fulltext-search">
              <div className="fulltext-title">Search article full text</div>
              <form action="/search" method="get">
                <input
                  className="fulltext-input"
                  name="q"
                  placeholder="Enter words or phrases to search within articles"
                />
                <button className="fulltext-button" type="submit">
                  Search
                </button>
              </form>
            </div>
            <h2>Search other data</h2>
            <div className="search-grid">
              {cards.map((row) => (
                <SearchCard
                  key={row.c}
                  name={row.n}
                  link={row.l}
                  callSign={row.c}
                  modelCls={row.m}
                />
              ))}
            </div>
          </>
        );
      }}
    />
  );
}
