
import { NameEndingBody_nameEnding } from "./__generated__/NameEndingBody_nameEnding.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class NameEndingBody extends React.Component<{
  nameEnding: NameEndingBody_nameEnding;
}> {
  render() {
    const { oid } = this.props.nameEnding;
    return (
      <>
        {oid}
      </>
    );
  }
}

export default createFragmentContainer(NameEndingBody, {
  nameEnding: graphql`
    fragment NameEndingBody_nameEnding on NameEnding {
      oid
    }
  `,
});
