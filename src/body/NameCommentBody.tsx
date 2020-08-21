import { NameCommentBody_nameComment } from "./__generated__/NameCommentBody_nameComment.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class NameCommentBody extends React.Component<{
  nameComment: NameCommentBody_nameComment;
}> {
  render() {
    const { oid } = this.props.nameComment;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(NameCommentBody, {
  nameComment: graphql`
    fragment NameCommentBody_nameComment on NameComment {
      oid
    }
  `,
});
