import { NameTitle_name } from "./__generated__/NameTitle_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics from "../components/MaybeItalics";

class NameTitle extends React.Component<{ name: NameTitle_name }> {
  render() {
    const {
      originalName,
      rootName,
      group,
      authority,
      year,
      pageDescribed,
    } = this.props.name;
    const name = originalName ? originalName : rootName;

    return (
      <>
        <MaybeItalics group={group} name={name} />
        {authority && " " + authority}
        {year && ", " + year}
        {pageDescribed && ":" + pageDescribed}
      </>
    );
  }
}

export default createFragmentContainer(NameTitle, {
  name: graphql`
    fragment NameTitle_name on Name {
      originalName
      rootName
      group
      authority
      year
      pageDescribed
    }
  `,
});
