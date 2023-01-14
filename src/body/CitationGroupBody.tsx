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
  citationGroup.tags.map((tag) => {
    switch (tag.__typename) {
      case "ISSN":
        data.push(["ISSN", tag.text]);
        break;
      case "ISSNOnline":
        data.push(["ISSN (online)", tag.text]);
        break;
      case "BHLBibliography":
        const url = `https://www.biodiversitylibrary.org/bibliography/${tag.text}`;
        data.push([
          "Biodiversity Heritage Library",
          <a href={url}>{tag.text}</a>,
        ]);
        break;
    }
  });
  if (!data) {
    return null;
  }
  return <Table data={data} />;
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
      }
      ...CitationGroupRedirects_citationGroup
      ...CitationGroupArticleSet_citationGroup
      ...CitationGroupNames_citationGroup
    }
  `,
});
