import { ArticleTitle_article } from "./__generated__/ArticleTitle_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class ArticleTitle extends React.Component<{ article: ArticleTitle_article }> {
  render() {
    const { authors, year } = this.props.article;

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
      authors
      year
    }
  `,
});
