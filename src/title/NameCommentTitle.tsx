import { NameCommentTitle_nameComment } from "./__generated__/NameCommentTitle_nameComment.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameTitle from "./NameTitle";

class NameCommentTitle extends React.Component<{
  nameComment: NameCommentTitle_nameComment;
}> {
  render() {
    const { commentName } = this.props.nameComment;

    return (
      <>
        Comment on <NameTitle name={commentName} />
      </>
    );
  }
}

export default createFragmentContainer(NameCommentTitle, {
  nameComment: graphql`
    fragment NameCommentTitle_nameComment on NameComment {
      commentName: name {
        ...NameTitle_name
      }
    }
  `,
});
