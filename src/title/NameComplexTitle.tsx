import { NameComplexTitle_nameComplex } from "./__generated__/NameComplexTitle_nameComplex.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class NameComplexTitle extends React.Component<{ nameComplex: NameComplexTitle_nameComplex }> {
  render() {
    const {
      label
    } = this.props.nameComplex;

    return (
      <>
        {label}
      </>
    );
  }
}

export default createFragmentContainer(NameComplexTitle, {
  nameComplex: graphql`
    fragment NameComplexTitle_nameComplex on NameComplex {
      label
    }
  `,
});
