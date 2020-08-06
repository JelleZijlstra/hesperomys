import { NameEndingTitle_nameEnding } from "./__generated__/NameEndingTitle_nameEnding.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class NameEndingTitle extends React.Component<{
  nameEnding: NameEndingTitle_nameEnding;
}> {
  render() {
    const { ending } = this.props.nameEnding;

    return <>-{ending}</>;
  }
}

export default createFragmentContainer(NameEndingTitle, {
  nameEnding: graphql`
    fragment NameEndingTitle_nameEnding on NameEnding {
      ending
    }
  `,
});
