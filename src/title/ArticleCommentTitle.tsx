import { ArticleCommentTitle_articleComment } from "./__generated__/ArticleCommentTitle_articleComment.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ArticleTitle from "./ArticleTitle";

class ArticleCommentTitle extends React.Component<{
  articleComment: ArticleCommentTitle_articleComment;
}> {
  render() {
    const { article } = this.props.articleComment;

    return (
      <>
        comment on <ArticleTitle article={article} />
      </>
    );
  }
}

export default createFragmentContainer(ArticleCommentTitle, {
  articleComment: graphql`
    fragment ArticleCommentTitle_articleComment on ArticleComment {
      article {
        ...ArticleTitle_article
      }
    }
  `,
});
