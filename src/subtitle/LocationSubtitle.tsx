import { LocationSubtitle_location } from "./__generated__/LocationSubtitle_location.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class LocationSubtitle extends React.Component<{
  location: LocationSubtitle_location;
}> {
  render() {
    const { locationRegion } = this.props.location;
    return (
      <>
        Location in <ModelLink model={locationRegion} />
        {locationRegion.parent !== null && (
          <>
            , <ModelLink model={locationRegion.parent} />
          </>
        )}
      </>
    );
  }
}

export default createFragmentContainer(LocationSubtitle, {
  location: graphql`
    fragment LocationSubtitle_location on Location {
      locationRegion: region {
        ...ModelLink_model
        parent {
          ...ModelLink_model
        }
      }
    }
  `,
});
