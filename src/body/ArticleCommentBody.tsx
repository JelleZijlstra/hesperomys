import { ArticleCommentBody_articleComment } from "./__generated__/ArticleCommentBody_articleComment.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class ArticleCommentBody extends React.Component<{
  articleComment: ArticleCommentBody_articleComment;
}> {
  render() {
    const { oid } = this.props.articleComment;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(ArticleCommentBody, {
  articleComment: graphql`
    fragment ArticleCommentBody_articleComment on ArticleComment {
      oid
    }
  `,
});
