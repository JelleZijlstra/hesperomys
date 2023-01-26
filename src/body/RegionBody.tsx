import { RegionBody_region } from "./__generated__/RegionBody_region.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import RegionChildren from "../lists/RegionChildren";
import RegionCitationGroups from "../lists/RegionCitationGroups";
import RegionCollections from "../lists/RegionCollections";
import RegionPeriods from "../lists/RegionPeriods";
import RegionLocations from "../lists/RegionLocations";

class RegionBody extends React.Component<{
  region: RegionBody_region;
}> {
  render() {
    const { region } = this.props;
    return (
      <>
        <RegionChildren region={region} title="Child regions" />
        <RegionLocations region={region} />
        <RegionPeriods region={region} title="Stratigraphic units" />
        <RegionCollections region={region} />
        <RegionCitationGroups region={region} />
      </>
    );
  }
}

export default createFragmentContainer(RegionBody, {
  region: graphql`
    fragment RegionBody_region on Region {
      ...RegionChildren_region
      ...RegionCitationGroups_region
      ...RegionCollections_region
      ...RegionPeriods_region
      ...RegionLocations_region
      ...RegionTypeLocalities_region
    }
  `,
});
