import { NamesMissingField_taxon } from "./__generated__/NamesMissingField_taxon.graphql";

import { createFragmentContainer } from "react-relay";

import React, { useCallback } from "react";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import graphql from "babel-plugin-relay/macro";

import { NamesMissingFieldQuery } from "./__generated__/NamesMissingFieldQuery.graphql";
import NamesMissingFieldResults from "./NamesMissingFieldResults";

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

import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import List from "react-tiny-virtual-list";

import { SearchBox_modelCls } from "./__generated__/SearchBox_modelCls.graphql";

import "react-bootstrap-typeahead/css/Typeahead.css";

const SearchBox = ({ setField }: { setField: (field: string) => void }) => {
  const renderMenu = useCallback(
    (results, menuProps) => {
      const itemHeight = 32;
      if (results.length === 0) {
        return null;
      }

      return (
        <Menu {...menuProps}>
          <List
            scrollToIndex={menuProps.activeIndex || 0}
            scrollToAlignment={"auto" as any}
            height={results.length < 5 ? results.length * itemHeight : 300}
            itemCount={results.length}
            itemSize={itemHeight}
            renderItem={({ index, style }) => {
              const item = results[index];
              return (
                <MenuItem
                  key={item}
                  option={item}
                  position={index}
                  style={style}
                  onClick={() => setField(item)}
                >
                  {item}
                </MenuItem>
              );
            }}
          />
        </Menu>
      );
    },
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
      filterBy={(option: string, props: { text: string }) =>
        option.toLowerCase().startsWith(props.text.toLowerCase())
      }
    />
  );
};

function NamesMissingField({ taxon }: { taxon: NamesMissingField_taxon }) {
  const [field, setField] = React.useState<string | null>(null);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setField(e.target.query.value);
    },
    [setField],
  );
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
