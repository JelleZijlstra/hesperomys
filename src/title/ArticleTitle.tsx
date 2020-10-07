import { ArticleTitle_article } from "./__generated__/ArticleTitle_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class ArticleTitle extends React.Component<{ article: ArticleTitle_article }> {
  render() {
    const { authorTags, year } = this.props.article;
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

    return (
      <>
        {authors} ({year})
      </>
    );
  }
}

export default createFragmentContainer(ArticleTitle, {
  article: graphql`
    fragment ArticleTitle_article on Article {
      authorTags {
        ... on Author {
          person {
            familyName
          }
        }
      }
      year
    }
  `,
});
