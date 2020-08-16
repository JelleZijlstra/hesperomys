import { RegionTitle_region } from "./__generated__/RegionTitle_region.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class RegionTitle extends React.Component<{ region: RegionTitle_region }> {
  render() {
    const { regionName } = this.props.region;

    return <>{regionName}</>;
  }
}

export default createFragmentContainer(RegionTitle, {
  region: graphql`
    fragment RegionTitle_region on Region {
      regionName: name
    }
  `,
});
