import { CitationGroupBody_citationGroup } from "./__generated__/CitationGroupBody_citationGroup.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CitationGroupOrderedNames from "../lists/CitationGroupOrderedNames";
import CitationGroupOrderedArticles from "../lists/CitationGroupOrderedArticles";
import CitationGroupRedirects from "../lists/CitationGroupRedirects";
import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import PublicationDate from "./PublicationDate";
import InlineMarkdown from "../components/InlineMarkdown";

const CitationGroupTags = ({
  citationGroup,
}: {
  citationGroup: CitationGroupBody_citationGroup;
}) => {
  const data: [string, JSX.Element | null | string][] = [];
  citationGroup.citationGroupTags.forEach((tag) => {
    switch (tag.__typename) {
      case "ISSNCG": {
        const url = `https://www.worldcat.org/search?fq=x0:jrnl&q=n2:${tag.text}`;
        data.push(["ISSN", <a href={url}>{tag.text}</a>]);
        break;
      }
      case "ISSNOnlineCG": {
        const url = `https://www.worldcat.org/search?fq=x0:jrnl&q=n2:${tag.text}`;
        data.push(["ISSN (online)", <a href={url}>{tag.text}</a>]);
        break;
      }
      case "BHLBibliographyCG": {
        const url = `https://www.biodiversitylibrary.org/bibliography/${tag.text}`;
        data.push(["Biodiversity Heritage Library", <a href={url}>{tag.text}</a>]);
        break;
      }
      case "URLCG":
        if (tag.text) {
          data.push(["URL", <a href={tag.text}>{tag.text}</a>]);
        }
        break;
      case "AbbreviatedTitleCG":
        data.push(["Abbreviated title", tag.text]);
        break;
      case "AlternativeNameCG":
        data.push([
          "Alternative name",
          <>
            {tag.text}
            {tag.alternativeNameComment && (
              <>
                ; <InlineMarkdown source={tag.alternativeNameComment} />
              </>
            )}
          </>,
        ]);
        break;
      case "PredecessorCG":
        data.push(["Previous name", <ModelLink model={tag.cg} />]);
        break;
      case "YearRangeCG":
        data.push(["Published during", `${tag.start}-${tag.end}`]);
        break;
      case "DatingToolsCG":
        data.push(["Comments on dating", <InlineMarkdown source={tag.text} />]);
        break;
      case "BiblioNoteCG":
        if (tag.text) {
          data.push([
            "Bibliographical discussion",
            <a href={`/docs/biblio/${tag.text}`}>{tag.text}</a>,
          ]);
        }
        break;
      case "CommentCG":
        if (tag.text) {
          data.push(["Comment", <InlineMarkdown source={tag.text} />]);
        }
        break;
    }
  });
  if (!data) {
    return null;
  }
  return (
    <>
      <Table data={data} />
    </>
  );
};

const IssueDate = ({
  issueDate,
  hasSeries,
  hasIssue,
}: {
  issueDate: Exclude<
    Exclude<
      Exclude<CitationGroupBody_citationGroup["issueDateSet"], null>["edges"][0],
      null
    >["node"],
    null
  >;
  hasSeries: boolean;
  hasIssue: boolean;
}) => {
  return (
    <tr>
      {hasSeries && <td>{issueDate.series || ""}</td>}
      <td>{issueDate.volume}</td>
      {hasIssue && <td>{issueDate.issue || ""}</td>}
      <td>
        {issueDate.startPage}–{issueDate.endPage}
      </td>
      <td>
        <PublicationDate
          date={issueDate.date}
          calendar={issueDate.tags
            .map((tag) => (tag.__typename === "CalendarID" ? tag.calendar : null))
            .find(Boolean)}
        />
      </td>
      <td>
        {issueDate.tags && (
          <ul>
            {issueDate.tags.map(
              (tag) =>
                tag.__typename === "CommentID" && (
                  <li key={tag.text}>
                    <InlineMarkdown source={tag.text} />
                    {tag.optionalSource && (
                      <>
                        {" "}
                        <small>
                          <ModelLink model={tag.optionalSource} />
                        </small>
                      </>
                    )}
                  </li>
                ),
            )}
          </ul>
        )}
      </td>
    </tr>
  );
};

const IssueDates = ({
  citationGroup,
}: {
  citationGroup: CitationGroupBody_citationGroup;
}) => {
  if (!citationGroup.issueDateSet || citationGroup.issueDateSet.edges.length === 0) {
    return null;
  }
  const issueDates = citationGroup.issueDateSet.edges
    .map((edge) => edge?.node)
    .filter((date) => date !== null && date !== undefined);
  issueDates.sort((a, b) => {
    if (a === b) {
      return 0;
    }
    if (!a) {
      return -1;
    }
    if (!b) {
      return 1;
    }
    if ((a.gregorianDate || a.date) < (b.gregorianDate || b.date)) {
      return -1;
    }
    if ((a.gregorianDate || a.date) === (b.gregorianDate || b.date)) {
      return 0;
    }
    return 1;
  });
  const hasSeries = issueDates.some((issueDate) => issueDate?.series);
  const hasIssue = issueDates.some((issueDate) => issueDate?.issue);
  return (
    <>
      <h3>Issue publication dates</h3>
      <table className="bordered">
        <thead>
          <tr>
            {hasSeries && <th>Series</th>}
            <th>Volume</th>
            {hasIssue && <th>Issue</th>}
            <th>Pages</th>
            <th>Date</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {issueDates.map(
            (issueDate) =>
              issueDate && (
                <IssueDate
                  key={issueDate.id}
                  hasSeries={hasSeries}
                  hasIssue={hasIssue}
                  issueDate={issueDate}
                />
              ),
          )}
        </tbody>
      </table>
    </>
  );
};

class CitationGroupBody extends React.Component<{
  citationGroup: CitationGroupBody_citationGroup;
}> {
  render() {
    const { citationGroup } = this.props;
    return (
      <>
        {citationGroup.target && (
          <p>
            Alias for <ModelLink model={citationGroup.target} />.
          </p>
        )}
        <CitationGroupTags citationGroup={citationGroup} />
        <IssueDates citationGroup={citationGroup} />
        <CitationGroupOrderedArticles
          citationGroup={citationGroup}
          title="Publications"
        />
        <CitationGroupOrderedNames
          citationGroup={citationGroup}
          title="Names published here"
        />
        <CitationGroupRedirects citationGroup={citationGroup} title="Aliases" />
      </>
    );
  }
}

export default createFragmentContainer(CitationGroupBody, {
  citationGroup: graphql`
    fragment CitationGroupBody_citationGroup on CitationGroup {
      target {
        ...ModelLink_model
      }
      citationGroupTags: tags {
        __typename
        ... on ISSNCG {
          text
        }
        ... on ISSNOnlineCG {
          text
        }
        ... on BHLBibliographyCG {
          text
        }
        ... on URLCG {
          text
        }
        ... on AbbreviatedTitleCG {
          text
        }
        ... on AlternativeNameCG {
          text
          alternativeNameComment: comment
        }
        ... on PredecessorCG {
          cg {
            ...ModelLink_model
          }
        }
        ... on YearRangeCG {
          start
          end
        }
        ... on DatingToolsCG {
          text
        }
        ... on BiblioNoteCG {
          text
        }
        ... on CommentCG {
          text
        }
      }
      issueDateSet(first: 1000) {
        edges {
          node {
            id
            series
            volume
            issue
            startPage
            endPage
            date
            gregorianDate
            tags {
              __typename
              ... on CalendarID {
                calendar
              }
              ... on CommentID {
                text
                optionalSource {
                  ...ModelLink_model
                }
              }
            }
          }
        }
      }
      ...CitationGroupRedirects_citationGroup
      ...CitationGroupOrderedArticles_citationGroup
      ...CitationGroupOrderedNames_citationGroup
    }
  `,
});
