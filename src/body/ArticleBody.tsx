import { ArticleBody_article } from "./__generated__/ArticleBody_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import ReactMarkdown from "react-markdown";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import AuthorList from "../components/AuthorList";
import Reference from "../reference/Reference";

import ArticleNewNames from "../lists/ArticleNewNames";
import ArticleArticleSet from "../lists/ArticleArticleSet";
import ArticlePartiallySuppressedNames from "../lists/ArticlePartiallySuppressedNames";
import ArticleFullySuppressedNames from "../lists/ArticleFullySuppressedNames";
import ArticleConservedNames from "../lists/ArticleConservedNames";
import ArticleSpellingSelections from "../lists/ArticleSpellingSelections";
import ArticlePrioritySelections from "../lists/ArticlePrioritySelections";
import ArticlePriorityReversals from "../lists/ArticlePriorityReversals";
import ArticleTypeDesignations from "../lists/ArticleTypeDesignations";
import ArticleCommissionTypeDesignations from "../lists/ArticleCommissionTypeDesignations";
import ArticleLectotypeDesignations from "../lists/ArticleLectotypeDesignations";
import ArticleNeotypeDesignations from "../lists/ArticleNeotypeDesignations";
import ArticleSpecimenDetails from "../lists/ArticleSpecimenDetails";
import ArticleLocationDetails from "../lists/ArticleLocationDetails";
import ArticleCollectionDetails from "../lists/ArticleCollectionDetails";
import ArticleCitationDetails from "../lists/ArticleCitationDetails";
import ArticleDefinitionDetails from "../lists/ArticleDefinitionDetails";
import ArticleEtymologyDetails from "../lists/ArticleEtymologyDetails";
import ArticleTypeSpeciesDetails from "../lists/ArticleTypeSpeciesDetails";
import ArticleComments from "../lists/ArticleComments";
import PublicationDate from "./PublicationDate";
import InlineMarkdown from "../components/InlineMarkdown";

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
const DATE_SOURCE_TO_STRING = new Map([
  ["internal", "evidence in the work itself"],
  ["external", "external evidence"],
  ["doi_published_print", "print publication date for DOI"],
  ["doi_published_online", "online publication date for DOI"],
  ["doi_published_other", "other publication date for DOI"],
  ["doi_published", "publication date for DOI"],
]);

class ArticleBody extends React.Component<{
  article: ArticleBody_article;
}> {
  render() {
    const { article } = this.props;
    const {
      articleType,
      authorTags,
      numericYear,
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
      articleName,
      path,
      tags,
    } = article;
    const data: [string, JSX.Element | null | string][] = [
      ["Type", TYPE_TO_STRING.get(articleType) || null],
      ["Authors", <AuthorList authorTags={authorTags} />],
    ];
    if (numericYear) {
      data.push(["Year of publication", String(numericYear)]);
    }
    if (year && (!numericYear || year !== String(numericYear))) {
      data.push(["Date of publication", <PublicationDate date={year} />]);
    }
    data.push(
      ["Title", title ? <ReactMarkdown children={title} /> : null],
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
    );
    if (doi) {
      const href = `https://dx.doi.org/${doi}`;
      data.push(["DOI", <a href={href}>{doi}</a>]);
    }
    tags.forEach((tag) => {
      let url: string | null = null;
      switch (tag.__typename) {
        case "ISBN":
          url = `https://en.wikipedia.org/wiki/Special:BookSources/${tag.text}`;
          break;
        case "HDL":
          url = `https://hdl.handle.net/${tag.text}`;
          break;
        case "JSTOR":
          url = `https://www.jstor.org/stable/${tag.text}`;
          break;
        case "PMID":
          url = `https://pubmed.ncbi.nlm.nih.gov/${tag.text}/`;
          break;
        case "PMC":
          url = `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${tag.text}/`;
          break;
        case "LSIDArticle":
          const zooBankurl = `https://zoobank.org/References/${tag.text}`;
          const label = `urn:lsid:zoobank.org:pub:${tag.text}`;
          data.push(["LSID (ZooBank)", <a href={zooBankurl}>{label}</a>]);
          break;
        case "PublicationDate": {
          const body = (
            <>
              <PublicationDate date={tag.date || ""} /> (
              {DATE_SOURCE_TO_STRING.get(tag.dateSource || "")}
              {tag.comment && (
                <>
                  ; <InlineMarkdown source={tag.comment} />
                </>
              )}
              )
            </>
          );
          data.push(["Evidence for date", body]);
          break;
        }
      }
      if (url !== null && "text" in tag) {
        data.push([tag.__typename, <a href={url}>{tag.text}</a>]);
      }
    });
    if (path && new URLSearchParams(window.location.search).get("showPath")) {
      data.push(["Path", path]);
      data.push(["File name", articleName]);
    }
    return (
      <>
        <p>
          <Reference article={article} />
        </p>
        <Table data={data} />
        <ArticleComments article={article} title="Comments" />
        <ArticleNewNames article={article} title="New names" />
        <ArticleArticleSet article={article} title="Child articles" />
        <ArticlePartiallySuppressedNames
          article={article}
          title="Partially suppressed names"
        />
        <ArticleFullySuppressedNames article={article} title="Fully suppressed names" />
        <ArticleConservedNames article={article} title="Conserved names" />
        <ArticleSpellingSelections article={article} title="Spelling selections" />
        <ArticlePrioritySelections article={article} title="Priority selections" />
        <ArticlePriorityReversals article={article} title="Priority reversals" />
        <ArticleTypeDesignations article={article} title="Type designations" />
        <ArticleCommissionTypeDesignations
          article={article}
          title="Commission type designations"
        />
        <ArticleLectotypeDesignations
          article={article}
          title="Lectotype designations"
        />
        <ArticleNeotypeDesignations article={article} title="Neotype designations" />
        <ArticleSpecimenDetails article={article} title="Specimen details" />
        <ArticleLocationDetails article={article} title="Location details" />
        <ArticleCollectionDetails article={article} title="Collection details" />
        <ArticleCitationDetails article={article} title="Citation details" />
        <ArticleDefinitionDetails article={article} title="Definition details" />
        <ArticleEtymologyDetails article={article} title="Etymology details" />
        <ArticleTypeSpeciesDetails article={article} title="Type species details" />
      </>
    );
  }
}

export default createFragmentContainer(ArticleBody, {
  article: graphql`
    fragment ArticleBody_article on Article {
      articleType: type
      authorTags {
        ...AuthorList_authorTags
      }
      year
      numericYear
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
      articleName: name
      path
      parent {
        ...ModelLink_model
      }
      citationGroup {
        ...ModelLink_model
      }
      tags {
        __typename
        ... on ISBN {
          text
        }
        ... on Eurobats {
          text
        }
        ... on HDL {
          text
        }
        ... on JSTOR {
          text
        }
        ... on PMID {
          text
        }
        ... on PMC {
          text
        }
        ... on LSIDArticle {
          text
        }
        ... on PublicationDate {
          dateSource: source
          date
          comment
        }
      }
      ...ArticleNewNames_article
      ...ArticleArticleSet_article
      ...ArticlePartiallySuppressedNames_article
      ...ArticleFullySuppressedNames_article
      ...ArticleConservedNames_article
      ...ArticleSpellingSelections_article
      ...ArticlePrioritySelections_article
      ...ArticlePriorityReversals_article
      ...ArticleTypeDesignations_article
      ...ArticleCommissionTypeDesignations_article
      ...ArticleLectotypeDesignations_article
      ...ArticleNeotypeDesignations_article
      ...ArticleSpecimenDetails_article
      ...ArticleLocationDetails_article
      ...ArticleCollectionDetails_article
      ...ArticleCitationDetails_article
      ...ArticleDefinitionDetails_article
      ...ArticleEtymologyDetails_article
      ...ArticleTypeSpeciesDetails_article
      ...ArticleComments_article
      ...Reference_article
    }
  `,
});
