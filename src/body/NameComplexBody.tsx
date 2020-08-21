
import { NameComplexBody_nameComplex } from "./__generated__/NameComplexBody_nameComplex.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class NameComplexBody extends React.Component<{
  nameComplex: NameComplexBody_nameComplex;
}> {
  render() {
    const { oid } = this.props.nameComplex;
    return (
      <>
        {oid}
      </>
    );
  }
}

export default createFragmentContainer(NameComplexBody, {
  nameComplex: graphql`
    fragment NameComplexBody_nameComplex on NameComplex {
      oid
    }
  `,
});
