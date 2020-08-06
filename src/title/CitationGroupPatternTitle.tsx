import { CitationGroupPatternTitle_citationGroupPattern } from "./__generated__/CitationGroupPatternTitle_citationGroupPattern.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class CitationGroupPatternTitle extends React.Component<{ citationGroupPattern: CitationGroupPatternTitle_citationGroupPattern }> {
  render() {
    const {
      pattern
    } = this.props.citationGroupPattern;

    return (
      <>
        "{pattern}"
      </>
    );
  }
}

export default createFragmentContainer(CitationGroupPatternTitle, {
  citationGroupPattern: graphql`
    fragment CitationGroupPatternTitle_citationGroupPattern on CitationGroupPattern {
      pattern
    }
  `,
});
