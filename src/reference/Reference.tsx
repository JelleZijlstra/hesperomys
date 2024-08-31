import { Reference_article } from "./__generated__/Reference_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import SimpleReference from "./SimpleReference";
import ReferencePrefix from "./ReferencePrefix";
import ReferenceSuffix from "./ReferenceSuffix";

class Reference extends React.Component<{ article: Reference_article }> {
  render() {
    const { article } = this.props;
    const { parent, type, oid, title, startPage, endPage } = article;
    switch (type) {
      case "PART":
      case "CHAPTER": {
        const hasPages = !!startPage;
        return (
          <>
            <ReferencePrefix article={article} />
            {hasPages &&
              (startPage === endPage || !endPage
                ? `P. ${startPage}`
                : `Pp. ${startPage}–${endPage}`)}
            {hasPages && !parent && "."}
            {parent && (
              <>
                {hasPages ? " in " : "In "}
                <SimpleReference article={parent} skipLinks />
              </>
            )}
            <ReferenceSuffix article={article} />
          </>
        );
      }
      case "SUPPLEMENT":
        return (
          <>
            <Link to={`/a/${oid}`}>{title || "Supplement"}</Link>
            {parent && (
              <>
                {" "}
                to <SimpleReference article={parent} skipLinks />
              </>
            )}
            <ReferenceSuffix article={article} />
          </>
        );
      case "REDIRECT":
        return (
          <>
            <Link to={`/a/${oid}`}>Alias</Link>
            {parent && (
              <>
                {" "}
                for <SimpleReference article={parent} skipLinks />
              </>
            )}
          </>
        );
      default:
        return (
          <>
            <SimpleReference article={article} />
          </>
        );
    }
  }
}

const ReferenceContainer = createFragmentContainer(Reference, {
  article: graphql`
    fragment Reference_article on Article {
      type
      ...ReferencePrefix_article
      ...ReferenceSuffix_article
      ...SimpleReference_article
      title
      startPage
      endPage
      oid
      parent {
        ...SimpleReference_article
      }
    }
  `,
});

export default ReferenceContainer;
