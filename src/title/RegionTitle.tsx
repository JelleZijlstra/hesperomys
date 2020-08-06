import { RegionTitle_region } from "./__generated__/RegionTitle_region.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class RegionTitle extends React.Component<{ region: RegionTitle_region }> {
  render() {
    const { name } = this.props.region;

    return <>{name}</>;
  }
}

export default createFragmentContainer(RegionTitle, {
  region: graphql`
    fragment RegionTitle_region on Region {
      name
    }
  `,
});
