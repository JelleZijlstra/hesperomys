import React from "react";
import { useHistory } from "react-router-dom";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

import { SearchBox_modelCls } from "./__generated__/SearchBox_modelCls.graphql";
import { getGraphQLUrl } from "../relayEnvironment";

import "react-bootstrap-typeahead/css/Typeahead.css";

const AUTOCOMPLETE_QUERY = `
  query SearchBoxAutocompleteQuery($callSign: String!, $query: String!) {
    modelCls(callSign: $callSign) {
      autocomplete(query: $query, limit: 50)
    }
  }
`;

async function fetchAutocompleteOptions(
  callSign: string,
  query: string,
): Promise<string[]> {
  const response = await fetch(getGraphQLUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: AUTOCOMPLETE_QUERY,
      variables: {
        callSign,
        query,
      },
    }),
  });
  const body = await response.json();
  return body.data?.modelCls?.autocomplete ?? [];
}

let nextSearchBoxId = 0;

export const SearchBox = ({
  modelCls,
  placeholder,
}: {
  modelCls: SearchBox_modelCls;
  placeholder?: string;
}) => {
  const history = useHistory();
  const [inputId] = React.useState(
    () => `searchBox-${modelCls.callSign}-${nextSearchBoxId++}`,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const latestRequest = React.useRef(0);

  const handleSearch = React.useCallback(
    (query: string) => {
      const requestId = latestRequest.current + 1;
      latestRequest.current = requestId;
      setIsLoading(true);
      fetchAutocompleteOptions(modelCls.callSign, query)
        .then((values) => {
          if (latestRequest.current === requestId) {
            setOptions(values);
          }
        })
        .catch(() => {
          if (latestRequest.current === requestId) {
            setOptions([]);
          }
        })
        .finally(() => {
          if (latestRequest.current === requestId) {
            setIsLoading(false);
          }
        });
    },
    [modelCls.callSign],
  );

  return (
    <AsyncTypeahead
      id={inputId}
      onChange={(selected) => {
        const text = selected[0];
        if (typeof text !== "string") return;
        const link = `/${modelCls.callSign.toLowerCase()}/${encodeURIComponent(text.replace(/\s+/g, "_"))}`;
        const win = window.open(link, "_blank");
        if (win) win.focus();
        else history.push(link);
      }}
      isLoading={isLoading}
      maxResults={10}
      minLength={1}
      onInputChange={(text) => {
        if (!text.trim()) {
          setOptions([]);
        }
      }}
      onSearch={handleSearch}
      options={options}
      paginate={false}
      placeholder={
        placeholder ??
        `Pick a ${modelCls.name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}`
      }
      useCache={false}
    />
  );
};

export default createFragmentContainer(SearchBox, {
  modelCls: graphql`
    fragment SearchBox_modelCls on ModelCls {
      callSign
      name
    }
  `,
});
