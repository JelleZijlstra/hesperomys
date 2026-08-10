import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { AsyncTypeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import { FixedSizeList as List } from "react-window";

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

const SearchBox = ({
  modelCls,
  placeholder,
}: {
  modelCls: SearchBox_modelCls;
  placeholder?: string;
}) => {
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

  const renderMenu = React.useCallback(
    (results: any[], menuProps: any, _state: any): React.ReactElement => {
      const ITEM_HEIGHT = 32;
      const VISIBLE = Math.min(results.length, 10);
      const height = Math.max(ITEM_HEIGHT, VISIBLE * ITEM_HEIGHT);
      const width = (menuProps && menuProps.style && menuProps.style.width) || 300;
      return (
        <Menu {...menuProps}>
          <List
            height={height}
            itemCount={results.length}
            itemSize={ITEM_HEIGHT}
            width={width}
          >
            {({ index, style }) => {
              const opt = results[index];
              const text = typeof opt === "string" ? opt : (opt?.label ?? String(opt));
              const link = `/${modelCls.callSign}/${text.replace(/\s+/g, "_")}`;
              return (
                <div style={style}>
                  <MenuItem
                    key={text}
                    option={opt}
                    position={index}
                    onClick={() => {
                      const win = window.open(link, "_blank");
                      if (win) win.focus();
                    }}
                  >
                    {text}
                  </MenuItem>
                </div>
              );
            }}
          </List>
        </Menu>
      );
    },
    [modelCls.callSign],
  );

  return (
    <AsyncTypeahead
      id={`searchBox-${modelCls.callSign}`}
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
      placeholder={placeholder ?? `Pick a ${modelCls.name}`}
      renderMenu={renderMenu}
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
