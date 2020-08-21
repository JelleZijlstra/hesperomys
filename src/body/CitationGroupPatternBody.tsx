import { CitationGroupPatternBody_citationGroupPattern } from "./__generated__/CitationGroupPatternBody_citationGroupPattern.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class CitationGroupPatternBody extends React.Component<{
  citationGroupPattern: CitationGroupPatternBody_citationGroupPattern;
}> {
  render() {
    const { oid } = this.props.citationGroupPattern;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(CitationGroupPatternBody, {
  citationGroupPattern: graphql`
    fragment CitationGroupPatternBody_citationGroupPattern on CitationGroupPattern {
      oid
    }
  `,
});
