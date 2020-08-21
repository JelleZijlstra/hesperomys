import { CollectionBody_collection } from "./__generated__/CollectionBody_collection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CollectionTypeSpecimens from "../lists/CollectionTypeSpecimens";

class CollectionBody extends React.Component<{
  collection: CollectionBody_collection;
}> {
  render() {
    const { collection } = this.props;
    return (
      <CollectionTypeSpecimens collection={collection} title="Type specimens" />
    );
  }
}

export default createFragmentContainer(CollectionBody, {
  collection: graphql`
    fragment CollectionBody_collection on Collection {
      ...CollectionTypeSpecimens_collection
    }
  `,
});
