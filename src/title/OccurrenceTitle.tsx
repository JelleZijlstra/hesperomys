import { OccurrenceTitle_occurrence } from "./__generated__/OccurrenceTitle_occurrence.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import TaxonTitle from "./TaxonTitle";
import LocationTitle from "./LocationTitle";

class OccurrenceTitle extends React.Component<{ occurrence: OccurrenceTitle_occurrence }> {
  render() {
    const {
      location, taxon
    } = this.props.occurrence;

    return (
      <>
        <TaxonTitle taxon={taxon} /> at <LocationTitle location={location} />
      </>
    );
  }
}

export default createFragmentContainer(OccurrenceTitle, {
  occurrence: graphql`
    fragment OccurrenceTitle_occurrence on Occurrence {
      taxon {
        ...TaxonTitle_taxon
      }
      location {
        ...LocationTitle_location
      }
    }
  `,
});
