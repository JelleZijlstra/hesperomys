import { SpeciesNameEndingTitle_speciesNameEnding } from "./__generated__/SpeciesNameEndingTitle_speciesNameEnding.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class SpeciesNameEndingTitle extends React.Component<{ speciesNameEnding: SpeciesNameEndingTitle_speciesNameEnding }> {
  render() {
    const {
      ending
    } = this.props.speciesNameEnding;

    return (
      <>
        -{ending}
      </>
    );
  }
}

export default createFragmentContainer(SpeciesNameEndingTitle, {
  speciesNameEnding: graphql`
    fragment SpeciesNameEndingTitle_speciesNameEnding on SpeciesNameEnding {
      ending
    }
  `,
});
