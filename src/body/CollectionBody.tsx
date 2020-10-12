import { CollectionBody_collection } from "./__generated__/CollectionBody_collection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CollectionTypeSpecimens from "../lists/CollectionTypeSpecimens";
import CollectionProbableSpecimens from "../lists/CollectionProbableSpecimens";
import CollectionSharedSpecimens from "../lists/CollectionSharedSpecimens";
import CollectionAssociatedPeople from "../lists/CollectionAssociatedPeople";

class CollectionBody extends React.Component<{
  collection: CollectionBody_collection;
}> {
  render() {
    const { collection } = this.props;
    return (
      <>
        <CollectionTypeSpecimens
          collection={collection}
          title="Type specimens"
        />
        <CollectionSharedSpecimens
          collection={collection}
          title="Shared type specimens"
          subtitle={<p>Part but not all of the type material for these names in this collection.</p>}
        />
        <CollectionProbableSpecimens
          collection={collection}
          title="Probable type specimens"
          subtitle={<p>Type material for these names is likely to be in this collection.</p>}
        />
        <CollectionAssociatedPeople
          collection={collection}
          title="Associated people"
        />
      </>
    );
  }
}

export default createFragmentContainer(CollectionBody, {
  collection: graphql`
    fragment CollectionBody_collection on Collection {
      ...CollectionTypeSpecimens_collection
      ...CollectionSharedSpecimens_collection
      ...CollectionProbableSpecimens_collection
      ...CollectionAssociatedPeople_collection
    }
  `,
});
