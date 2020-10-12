import { SimpleReference_article } from "./__generated__/SimpleReference_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ReferencePrefix from "./ReferencePrefix";
import ReferenceSuffix from "./ReferenceSuffix";

class SimpleReference extends React.Component<{
  article: SimpleReference_article;
  skipLinks?: boolean;
}> {
  render() {
    const { article, skipLinks } = this.props;
    const {
      type,
      citationGroup,
      series,
      volume,
      issue,
      startPage,
      endPage,
    } = article;
    switch (type) {
      case "JOURNAL":
        return (
          <>
            <ReferencePrefix article={article} skipLinks={skipLinks} />
            {citationGroup && citationGroup.name + " "}
            {series && `(${series})`}
            {volume && volume}
            {issue && `(${issue})`}:
            {startPage === endPage || !endPage
              ? startPage
              : `${startPage}–${endPage}`}
            .
            <ReferenceSuffix article={article} skipLinks={skipLinks} />
          </>
        );
      case "THESIS":
        return (
          <>
            <ReferencePrefix article={article} skipLinks={skipLinks} />
            {article.series && article.series + " thesis, "}
            {article.citationGroup && article.citationGroup.name + ", "}
            {article.pages && article.pages + " pp."}
            <ReferenceSuffix article={article} skipLinks={skipLinks} />
          </>
        );
      case "BOOK":
        return (
          <>
            <ReferencePrefix article={article} skipLinks={skipLinks} />
            {article.publisher && article.publisher + ", "}
            {article.citationGroup && article.citationGroup.name + ", "}
            {article.pages && article.pages + " pp."}
            <ReferenceSuffix article={article} skipLinks={skipLinks} />
          </>
        );
      default:
        return (
          <>
            <ReferencePrefix article={article} skipLinks={skipLinks} />
            <ReferenceSuffix article={article} skipLinks={skipLinks} />
          </>
        );
    }
  }
}

export default createFragmentContainer(SimpleReference, {
  article: graphql`
    fragment SimpleReference_article on Article {
      type
      ...ReferencePrefix_article
      ...ReferenceSuffix_article
      citationGroup {
        name
      }
      series
      volume
      issue
      startPage
      endPage
      pages
      publisher
    }
  `,
});
