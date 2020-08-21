import { SpeciesNameEndingBody_speciesNameEnding } from "./__generated__/SpeciesNameEndingBody_speciesNameEnding.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class SpeciesNameEndingBody extends React.Component<{
  speciesNameEnding: SpeciesNameEndingBody_speciesNameEnding;
}> {
  render() {
    const { oid } = this.props.speciesNameEnding;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(SpeciesNameEndingBody, {
  speciesNameEnding: graphql`
    fragment SpeciesNameEndingBody_speciesNameEnding on SpeciesNameEnding {
      oid
    }
  `,
});
