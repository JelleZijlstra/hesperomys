import { ArticleBody_article } from "./__generated__/ArticleBody_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class ArticleBody extends React.Component<{
  article: ArticleBody_article;
}> {
  render() {
    const { oid } = this.props.article;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(ArticleBody, {
  article: graphql`
    fragment ArticleBody_article on Article {
      oid
    }
  `,
});
