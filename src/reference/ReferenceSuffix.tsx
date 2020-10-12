import { ReferenceSuffix_article } from "./__generated__/ReferenceSuffix_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

export const ReferenceSuffix = ({
  article,
  skipLinks,
}: {
  article: ReferenceSuffix_article;
  skipLinks?: boolean;
}) =>
  skipLinks ? null : (
    <>
      {article.url && (
        <>
          {" "}
          <a href={article.url}>{article.url}</a>.
        </>
      )}
      {article.doi && (
        <>
          {" "}
          doi:<a href={`https://dx.doi.org/${article.doi}`}>{article.doi}</a>.
        </>
      )}
    </>
  );

export default createFragmentContainer(ReferenceSuffix, {
  article: graphql`
    fragment ReferenceSuffix_article on Article {
      url
      doi
    }
  `,
});
