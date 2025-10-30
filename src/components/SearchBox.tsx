import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import { FixedSizeList as List } from "react-window";

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
