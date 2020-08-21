import { CollectionSubtitle_collection } from "./__generated__/CollectionSubtitle_collection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class CollectionSubtitle extends React.Component<{
  collection: CollectionSubtitle_collection;
}> {
  render() {
    const { city, location } = this.props.collection;
    return (
      <>
        In {city && city + ", "}
        <ModelLink model={location} />
      </>
    );
  }
}

export default createFragmentContainer(CollectionSubtitle, {
  collection: graphql`
    fragment CollectionSubtitle_collection on Collection {
      city
      location {
        ...ModelLink_model
      }
    }
  `,
});
