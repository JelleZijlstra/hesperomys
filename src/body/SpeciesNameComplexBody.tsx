import { SpeciesNameComplexBody_speciesNameComplex } from "./__generated__/SpeciesNameComplexBody_speciesNameComplex.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class SpeciesNameComplexBody extends React.Component<{
  speciesNameComplex: SpeciesNameComplexBody_speciesNameComplex;
}> {
  render() {
    const { oid } = this.props.speciesNameComplex;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(SpeciesNameComplexBody, {
  speciesNameComplex: graphql`
    fragment SpeciesNameComplexBody_speciesNameComplex on SpeciesNameComplex {
      oid
    }
  `,
});
