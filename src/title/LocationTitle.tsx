import { LocationTitle_location } from "./__generated__/LocationTitle_location.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class LocationTitle extends React.Component<{ location: LocationTitle_location }> {
  render() {
    const {
      name
    } = this.props.location;

    return (
      <>
        {name}
      </>
    );
  }
}

export default createFragmentContainer(LocationTitle, {
  location: graphql`
    fragment LocationTitle_location on Location {
      name
    }
  `,
});
