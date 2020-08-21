
import { RegionBody_region } from "./__generated__/RegionBody_region.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class RegionBody extends React.Component<{
  region: RegionBody_region;
}> {
  render() {
    const { oid } = this.props.region;
    return (
      <>
        {oid}
      </>
    );
  }
}

export default createFragmentContainer(RegionBody, {
  region: graphql`
    fragment RegionBody_region on Region {
      oid
    }
  `,
});
