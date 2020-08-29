import { ArticleBody_article } from "./__generated__/ArticleBody_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

import ArticleNewNames from "../lists/ArticleNewNames";
import ArticleArticleSet from "../lists/ArticleArticleSet";

const TYPE_TO_STRING = new Map([
  ["ERROR", "unknown"],
  ["CHAPTER", "book chapter"],
  ["BOOK", "book"],
  ["THESIS", "thesis"],
  ["WEB", "online publication"],
  ["MISCELLANEOUS", "miscellaneous"],
  ["SUPPLEMENT", "supplement"],
  ["JOURNAL", "journal article"],
  ["REDIRECT", "alias"],
]);
const TYPE_TO_CG_LABEL = new Map([
  ["BOOK", "City of publication"],
  ["THESIS", "University"],
  ["JOURNAL", "Journal"],
]);

class ArticleBody extends React.Component<{
  article: ArticleBody_article;
}> {
  render() {
    const { article } = this.props;
    const {
      articleType,
      authors,
      year,
      title,
      series,
      volume,
      issue,
      startPage,
      endPage,
      url,
      doi,
      publisher,
      pages,
      parent,
      citationGroup,
    } = article;
    const data: [string, JSX.Element | null | string][] = [
      ["Type", TYPE_TO_STRING.get(articleType) || null],
      ["Authors", authors],
      ["Year of publication", year],
      ["Title", title],
      ["Publisher", publisher],
      [
        TYPE_TO_CG_LABEL.get(articleType) || "Citation group",
        citationGroup ? <ModelLink model={citationGroup} /> : null,
      ],
      ["Series", series],
      ["Volume", volume],
      ["Issue", issue],
      ["Start page", startPage],
      ["End page", endPage],
      ["Number of pages", pages],
      ["Parent article", parent ? <ModelLink model={parent} /> : null],
      ["URL", url ? <a href={url}>{url}</a> : null],
    ];
    if (doi) {
      const href = `https://dx.doi.org/${doi}`;
      data.push(["DOI", <a href={href}>{doi}</a>]);
    }
    return (
      <>
        <Table data={data} />
        <ArticleNewNames article={article} title="New names" />
        <ArticleArticleSet article={article} title="Child articles" />
      </>
    );
  }
}

export default createFragmentContainer(ArticleBody, {
  article: graphql`
    fragment ArticleBody_article on Article {
      articleType: type
      authors
      year
      title
      series
      volume
      issue
      startPage
      endPage
      url
      doi
      publisher
      pages
      parent {
        ...ModelLink_model
      }
      citationGroup {
        ...ModelLink_model
      }
      ...ArticleNewNames_article
      ...ArticleArticleSet_article
    }
  `,
});
