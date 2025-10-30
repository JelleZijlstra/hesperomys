import { NamesMissingField_taxon } from "./__generated__/NamesMissingField_taxon.graphql";

import { createFragmentContainer } from "react-relay";

import React from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";

import { NamesMissingFieldQuery } from "./__generated__/NamesMissingFieldQuery.graphql";
import NamesMissingFieldResults from "./NamesMissingFieldResults";

import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";

function ResultsRenderer({ field, oid }: { field: string; oid: number }) {
  return (
    <QueryRenderer<NamesMissingFieldQuery>
      environment={environment}
      query={graphql`
        query NamesMissingFieldQuery($field: String!, $oid: Int!) {
          ...NamesMissingFieldResults_queryRoot @arguments(field: $field, oid: $oid)
        }
      `}
      variables={{ field, oid }}
      render={({ error, props }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        return <NamesMissingFieldResults queryRoot={props} field={field} oid={oid} />;
      }}
    />
  );
}

const SearchBox = ({ setField }: { setField: (field: string) => void }) => {
  const renderMenu = React.useCallback(
    (results: any[], menuProps: any, _state: any): React.ReactElement => (
      <Menu {...menuProps}>
        {results.map((opt: any, index: number) => {
          const text = typeof opt === "string" ? opt : (opt?.label ?? String(opt));
          return (
            <MenuItem
              key={text}
              option={opt}
              position={index}
              onClick={() => setField(text)}
            >
              {text}
            </MenuItem>
          );
        })}
      </Menu>
    ),
    [setField],
  );

  return (
    <Typeahead
      id="namesMissingField"
      maxResults={10}
      options={[
        "original_citation",
        "verbatim_citation",
        "year",
        "type_locality",
        "type_specimen",
        "type",
        "collection",
        "original_name",
        "page_described",
        "name_complex",
        "species_name_complex",
      ]}
      paginate={false}
      placeholder="Start typing a field"
      renderMenu={renderMenu}
    />
  );
};

function NamesMissingField({ taxon }: { taxon: NamesMissingField_taxon }) {
  const [field, setField] = React.useState<string | null>(null);
  return (
    <>
      <h3>Find missing data</h3>
      <p>
        This form can be used to find names in this taxon that are missing some
        important data. For performance reasons, only the first 1000 names in the taxon
        are searched.
      </p>
      <SearchBox setField={setField} />
      {field ? (
        <ResultsRenderer field={field} oid={taxon.oid} />
      ) : (
        <>
          <br />
          <br />
        </>
      )}
    </>
  );
}

export default createFragmentContainer(NamesMissingField, {
  taxon: graphql`
    fragment NamesMissingField_taxon on Taxon {
      oid
    }
  `,
});
