import { AuthorList_authorTags } from "./__generated__/AuthorList_authorTags.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class AuthorList extends React.Component<{
  authorTags: AuthorList_authorTags;
}> {
  render() {
    const { authorTags } = this.props;

    return (
      <ul>
        {authorTags.map(
          (tag) =>
            tag &&
            tag.person && (
              <li key={tag.person.oid}>
                <ModelLink model={tag.person} />
              </li>
            ),
        )}
      </ul>
    );
  }
}

export default createFragmentContainer(AuthorList, {
  authorTags: graphql`
    fragment AuthorList_authorTags on AuthorTag @relay(plural: true) {
      ... on Author {
        person {
          oid
          ...ModelLink_model
        }
      }
    }
  `,
});
