import { NameTitle_name } from "./__generated__/NameTitle_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics from "../components/MaybeItalics";
import TaxonomicAuthority from "../reference/TaxonomicAuthority";

class NameTitle extends React.Component<{ name: NameTitle_name }> {
  render() {
    const { originalName, rootName, group, authorTags, year, pageDescribed } =
      this.props.name;
    let name;
    if (originalName) {
      name = originalName;
    } else if (group === "family") {
      name = rootName + "-";
    } else {
      name = rootName;
    }

    return (
      <>
        <MaybeItalics group={group} name={name} />{" "}
        <TaxonomicAuthority authorTags={authorTags} />
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
      authorTags {
        ...TaxonomicAuthority_authorTags
      }
      year
      pageDescribed
    }
  `,
});
