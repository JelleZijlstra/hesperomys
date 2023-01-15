import { CitationGroupBody_citationGroup } from "./__generated__/CitationGroupBody_citationGroup.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CitationGroupNames from "../lists/CitationGroupNames";
import CitationGroupArticleSet from "../lists/CitationGroupArticleSet";
import CitationGroupRedirects from "../lists/CitationGroupRedirects";
import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

const CitationGroupTags = ({
  citationGroup,
}: {
  citationGroup: CitationGroupBody_citationGroup;
}) => {
  const data: [string, JSX.Element | null | string][] = [];
  let showLink = false;
  citationGroup.tags.map((tag) => {
    switch (tag.__typename) {
      case "ISSN": {
        const url = `https://www.worldcat.org/search?fq=x0:jrnl&q=n2:${tag.text}`;
        data.push(["ISSN", <a href={url}>{tag.text}</a>]);
        break;
      }
      case "ISSNOnline": {
        const url = `https://www.worldcat.org/search?fq=x0:jrnl&q=n2:${tag.text}`;
        data.push(["ISSN (online)", <a href={url}>{tag.text}</a>]);
        break;
      }
      case "BHLBibliography": {
        const url = `https://www.biodiversitylibrary.org/bibliography/${tag.text}`;
        data.push([
          "Biodiversity Heritage Library",
          <a href={url}>{tag.text}</a>,
        ]);
        break;
      }
      case "CitationGroupURL":
        if (tag.text) {
          data.push(["URL", <a href={tag.text}>{tag.text}</a>]);
        }
        break;
      case "Predecessor":
        data.push(["Previous name", <ModelLink model={tag.cg} />]);
        showLink = true;
        break;
      case "YearRange":
        data.push(["Published during", `${tag.start}-${tag.end}`]);
        showLink = true;
        break;
    }
  });
  if (!data) {
    return null;
  }
  return (
    <>
      <Table data={data} />

      {showLink && (
        <p>
          <a href="/docs/tricky-journals">See note on "Tricky journals"</a>
        </p>
      )}
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
        <CitationGroupArticleSet
          citationGroup={citationGroup}
          title="Publications"
        />
        <CitationGroupNames
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
      tags {
        __typename
        ... on ISSN {
          text
        }
        ... on ISSNOnline {
          text
        }
        ... on BHLBibliography {
          text
        }
        ... on CitationGroupURL {
          text
        }
        ... on Predecessor {
          cg {
            ...ModelLink_model
          }
        }
        ... on YearRange {
          start
          end
        }
      }
      ...CitationGroupRedirects_citationGroup
      ...CitationGroupArticleSet_citationGroup
      ...CitationGroupNames_citationGroup
    }
  `,
});
