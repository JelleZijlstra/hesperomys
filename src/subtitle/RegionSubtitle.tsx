import { RegionSubtitle_region } from "./__generated__/RegionSubtitle_region.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

const KIND_TO_TEXT = new Map([
  ["continent", "Continent"],
  ["country", "Country"],
  ["subnational", "Subnational unit"],
  ["planet", "Planet"],
  ["other", "Other region"],
  ["county", "County"],
]);

class RegionSubtitle extends React.Component<{
  region: RegionSubtitle_region;
}> {
  render() {
    const { parent, kind } = this.props.region;
    return (
      <>
        {KIND_TO_TEXT.get(kind)}
        {parent && (
          <>
            {" "}
            in <ModelLink model={parent} />
          </>
        )}
      </>
    );
  }
}

export default createFragmentContainer(RegionSubtitle, {
  region: graphql`
    fragment RegionSubtitle_region on Region {
      kind
      parent {
        ...ModelLink_model
      }
    }
  `,
});
