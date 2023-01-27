import { ArticleTitle_article } from "./__generated__/ArticleTitle_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import TaxonomicAuthority from "../reference/TaxonomicAuthority";

class ArticleTitle extends React.Component<{ article: ArticleTitle_article }> {
  render() {
    const { authorTags, numericYear } = this.props.article;
    return (
      <>
        <TaxonomicAuthority authorTags={authorTags} /> ({numericYear})
      </>
    );
  }
}

export default createFragmentContainer(ArticleTitle, {
  article: graphql`
    fragment ArticleTitle_article on Article {
      authorTags {
        ...TaxonomicAuthority_authorTags
      }
      numericYear
    }
  `,
});
