
import { LocationBody_location } from "./__generated__/LocationBody_location.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class LocationBody extends React.Component<{
  location: LocationBody_location;
}> {
  render() {
    const { oid } = this.props.location;
    return (
      <>
        {oid}
      </>
    );
  }
}

export default createFragmentContainer(LocationBody, {
  location: graphql`
    fragment LocationBody_location on Location {
      oid
    }
  `,
});
