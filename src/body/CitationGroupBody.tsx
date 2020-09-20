import { CitationGroupBody_citationGroup } from "./__generated__/CitationGroupBody_citationGroup.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CitationGroupNames from "../lists/CitationGroupNames";
import CitationGroupArticleSet from "../lists/CitationGroupArticleSet";
import CitationGroupRedirects from "../lists/CitationGroupRedirects";
import ModelLink from "../components/ModelLink";

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
      ...CitationGroupRedirects_citationGroup
      ...CitationGroupArticleSet_citationGroup
      ...CitationGroupNames_citationGroup
    }
  `,
});
