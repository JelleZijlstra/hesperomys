import { CollectionTitle_collection } from "./__generated__/CollectionTitle_collection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class CollectionTitle extends React.Component<{
  collection: CollectionTitle_collection;
}> {
  render() {
    const { collectionName, label } = this.props.collection;

    return (
      <>
        {collectionName} ({label})
      </>
    );
  }
}

export default createFragmentContainer(CollectionTitle, {
  collection: graphql`
    fragment CollectionTitle_collection on Collection {
      label
      collectionName: name
    }
  `,
});
