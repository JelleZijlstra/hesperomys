import React, { useCallback } from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import List from "react-tiny-virtual-list";
import { Link } from "react-router-dom";

import { SearchBox_modelCls } from "./__generated__/SearchBox_modelCls.graphql";

import "react-bootstrap-typeahead/css/Typeahead.css";

const SearchBox = ({ modelCls }: { modelCls: SearchBox_modelCls }) => {
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
              const link = `/${modelCls.callSign}/${item.replace(" ", "_")}`;
              return (
                <MenuItem
                  key={item}
                  option={item}
                  position={index}
                  style={style}
                >
                  <Link to={link}>{item}</Link>
                </MenuItem>
              );
            }}
          />
        </Menu>
      );
    },
    [modelCls.callSign]
  );

  return (
    <Typeahead
      id={`searchBox-${modelCls.callSign}`}
      maxResults={10}
      options={[...modelCls.autocompletions]}
      paginate={false}
      placeholder={`Pick a ${modelCls.name}`}
      renderMenu={renderMenu}
      filterBy={(option: string, props: { text: string }) =>
        option.toLowerCase().startsWith(props.text.toLowerCase())
      }
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
