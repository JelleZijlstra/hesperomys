import { TaxonomicAuthority_authorTags } from "./__generated__/TaxonomicAuthority_authorTags.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class TaxonomicAuthority extends React.Component<{
  authorTags: TaxonomicAuthority_authorTags;
}> {
  render() {
    const { authorTags } = this.props;
    const familyNames = authorTags
      .map((tag) =>
        tag && tag.person && tag.person.familyName ? tag.person.familyName : ""
      )
      .filter((name) => name);
    const authors =
      familyNames.length <= 2
        ? familyNames.join(" & ")
        : familyNames.slice(0, -1).join(", ") +
          " & " +
          familyNames[familyNames.length - 1];

    return <>{authors}</>;
  }
}

export default createFragmentContainer(TaxonomicAuthority, {
  authorTags: graphql`
    fragment TaxonomicAuthority_authorTags on AuthorTag @relay(plural: true) {
      ... on Author {
        person {
          familyName
        }
      }
    }
  `,
});
