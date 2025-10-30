import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

import { SearchBox_modelCls } from "./__generated__/SearchBox_modelCls.graphql";

import "react-bootstrap-typeahead/css/Typeahead.css";

const SearchBox = ({
  modelCls,
  placeholder,
}: {
  modelCls: SearchBox_modelCls;
  placeholder?: string;
}) => {
  const renderMenu = React.useCallback(
    (results: any[], menuProps: any, _state: any): React.ReactElement => (
      <Menu {...menuProps}>
        {results.map((opt: any, index: number) => {
          const text = typeof opt === "string" ? opt : (opt?.label ?? String(opt));
          const link = `/${modelCls.callSign}/${text.replace(/\s+/g, "_")}`;
          return (
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
          );
        })}
      </Menu>
    ),
    [modelCls.callSign],
  );

  return (
    <Typeahead
      id={`searchBox-${modelCls.callSign}`}
      maxResults={10}
      options={[...modelCls.autocompletions]}
      paginate={false}
      placeholder={placeholder ?? `Pick a ${modelCls.name}`}
      renderMenu={renderMenu}
    />
  );
};

export default createFragmentContainer(SearchBox, {
  modelCls: graphql`
    fragment SearchBox_modelCls on ModelCls {
      callSign
      name
      autocompletions
    }
  `,
});
