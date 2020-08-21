import { LocationBody_location } from "./__generated__/LocationBody_location.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import LocationTypeLocalities from "../lists/LocationTypeLocalities";

class LocationBody extends React.Component<{
  location: LocationBody_location;
}> {
  render() {
    const { location } = this.props;
    const data: [string, JSX.Element][] = [];
    data.push(["Region", <ModelLink model={location.locationRegion} />]);
    if (location.minPeriod) {
      data.push(["Minimum age", <ModelLink model={location.minPeriod} />]);
    }
    if (location.maxPeriod) {
      data.push(["Maximum age", <ModelLink model={location.maxPeriod} />]);
    }
    if (location.stratigraphicUnit) {
      data.push([
        "Stratigraphic unit",
        <ModelLink model={location.stratigraphicUnit} />,
      ]);
    }
    return (
      <>
        <Table data={data} />
        <LocationTypeLocalities location={location} title="Type localities" />
      </>
    );
  }
}

export default createFragmentContainer(LocationBody, {
  location: graphql`
    fragment LocationBody_location on Location {
      minPeriod {
        ...ModelLink_model
      }
      maxPeriod {
        ...ModelLink_model
      }
      stratigraphicUnit {
        ...ModelLink_model
      }
      locationRegion: region {
        ...ModelLink_model
      }
      ...LocationTypeLocalities_location
    }
  `,
});
