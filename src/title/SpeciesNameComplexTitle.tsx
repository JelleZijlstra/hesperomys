import { SpeciesNameComplexTitle_speciesNameComplex } from "./__generated__/SpeciesNameComplexTitle_speciesNameComplex.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class SpeciesNameComplexTitle extends React.Component<{ speciesNameComplex: SpeciesNameComplexTitle_speciesNameComplex }> {
  render() {
    const {
      label
    } = this.props.speciesNameComplex;

    return (
      <>
        {label}
      </>
    );
  }
}

export default createFragmentContainer(SpeciesNameComplexTitle, {
  speciesNameComplex: graphql`
    fragment SpeciesNameComplexTitle_speciesNameComplex on SpeciesNameComplex {
      label
    }
  `,
});
