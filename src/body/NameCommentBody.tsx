import { NameCommentBody_nameComment } from "./__generated__/NameCommentBody_nameComment.graphql";

import React from "react";
import ReactMarkdown from "react-markdown";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

class NameCommentBody extends React.Component<{
  nameComment: NameCommentBody_nameComment;
}> {
  render() {
    const { name, commentKind, date, text, source, page } = this.props.nameComment;
    const data: [string, JSX.Element | null | string][] = [
      ["Name", <ModelLink model={name} />],
      ["Kind", commentKind],
      ["Date", new Date(date * 1000).toDateString()],
      ["Text", <ReactMarkdown children={text} />],
      ["Source", source ? <ModelLink model={source} /> : null],
      ["Page", page],
    ];
    return <Table data={data} />;
  }
}

export default createFragmentContainer(NameCommentBody, {
  nameComment: graphql`
    fragment NameCommentBody_nameComment on NameComment {
      oid
      name {
        ...ModelLink_model
      }
      commentKind: kind
      date
      text
      source {
        ...ModelLink_model
      }
      page
    }
  `,
});
