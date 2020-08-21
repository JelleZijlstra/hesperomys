
import { CollectionBody_collection } from "./__generated__/CollectionBody_collection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class CollectionBody extends React.Component<{
  collection: CollectionBody_collection;
}> {
  render() {
    const { oid } = this.props.collection;
    return (
      <>
        {oid}
      </>
    );
  }
}

export default createFragmentContainer(CollectionBody, {
  collection: graphql`
    fragment CollectionBody_collection on Collection {
      oid
    }
  `,
});
