import { CitationGroupTitle_citationGroup } from "./__generated__/CitationGroupTitle_citationGroup.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class CitationGroupTitle extends React.Component<{
  citationGroup: CitationGroupTitle_citationGroup;
}> {
  render() {
    const { cgName } = this.props.citationGroup;

    return <>{cgName}</>;
  }
}

export default createFragmentContainer(CitationGroupTitle, {
  citationGroup: graphql`
    fragment CitationGroupTitle_citationGroup on CitationGroup {
      cgName: name
    }
  `,
});
