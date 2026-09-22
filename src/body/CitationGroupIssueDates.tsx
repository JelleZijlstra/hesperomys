import React from "react";
import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { CitationGroupIssueDates_citationGroup } from "./__generated__/CitationGroupIssueDates_citationGroup.graphql";
import ModelLink from "../components/ModelLink";
import LoadMoreButton from "../components/LoadMoreButton";
import InlineMarkdown from "../components/InlineMarkdown";
import PublicationDate from "./PublicationDate";

const IssueDate = ({
  issueDate,
  hasSeries,
  hasIssue,
}: {
  issueDate: Exclude<
    Exclude<
      Exclude<CitationGroupIssueDates_citationGroup["issueDateSet"], null>["edges"][0],
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

export const IssueDates = ({
  citationGroup,
  relay,
}: {
  citationGroup: CitationGroupIssueDates_citationGroup;
  relay: RelayPaginationProp;
}) => {
  if (!citationGroup.issueDateSet || citationGroup.issueDateSet.edges.length === 0) {
    return null;
  }
  const issueDates = citationGroup.issueDateSet.edges
    .map((edge) => edge?.node)
    .filter((date) => date !== null && date !== undefined);
  const hasSeries = issueDates.some((issueDate) => issueDate?.series);
  const hasIssue = issueDates.some((issueDate) => issueDate?.issue);
  return (
    <>
      <h3>Issue publication dates ({citationGroup.numIssueDateSet})</h3>
      <p role="status">
        Showing {issueDates.length} of {citationGroup.numIssueDateSet} issue dates.
      </p>
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
      <LoadMoreButton relay={relay} numToLoad={100} />
    </>
  );
};

export default createPaginationContainer(
  IssueDates,
  {
    citationGroup: graphql`
      fragment CitationGroupIssueDates_citationGroup on CitationGroup
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 100 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numIssueDateSet
        issueDateSet(first: $count, after: $cursor)
          @connection(key: "CitationGroupIssueDates_issueDateSet") {
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
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.citationGroup.issueDateSet,
    getVariables(props, { count, cursor }) {
      return { oid: props.citationGroup.oid, count, cursor };
    },
    query: graphql`
      query CitationGroupIssueDatesPaginationQuery(
        $oid: Int!
        $count: Int!
        $cursor: String
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupIssueDates_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
