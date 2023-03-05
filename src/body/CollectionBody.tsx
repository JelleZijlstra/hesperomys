import { CollectionBody_collection } from "./__generated__/CollectionBody_collection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CollectionTypeSpecimens from "../lists/CollectionTypeSpecimens";
import CollectionProbableSpecimens from "../lists/CollectionProbableSpecimens";
import CollectionSharedSpecimens from "../lists/CollectionSharedSpecimens";
import CollectionAssociatedPeople from "../lists/CollectionAssociatedPeople";
import ModelLink from "../components/ModelLink";

type CollectionTag = Exclude<CollectionBody_collection["tags"][0], null>;

function SingleTag({ tag }: { tag: CollectionTag }) {
  switch (tag.__typename) {
    case "CollectionDatabase":
      return (
        <>
          Online collection database: <ModelLink model={tag.citation} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "TypeCatalog":
      return (
        <>
          Type catalog: <ModelLink model={tag.citation} />
          {tag.coverage && ` (coverage: ${tag.coverage})`}
        </>
      );
  }
  return null;
}

function Tags({ collection: { tags } }: { collection: CollectionBody_collection }) {
  if (!tags || tags.length === 0) {
    return null;
  }
  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag.__typename}>
          <SingleTag tag={tag} />
        </li>
      ))}
    </ul>
  );
}

class CollectionBody extends React.Component<{
  collection: CollectionBody_collection;
}> {
  render() {
    const { collection } = this.props;
    return (
      <>
        <Tags collection={collection} />
        <CollectionTypeSpecimens collection={collection} title="Type specimens" />
        <CollectionSharedSpecimens
          collection={collection}
          title="Shared type specimens"
          subtitle={
            <p>
              Part but not all of the type material for these names in this collection.
            </p>
          }
        />
        <CollectionProbableSpecimens
          collection={collection}
          title="Probable type specimens"
          subtitle={
            <p>Type material for these names is likely to be in this collection.</p>
          }
        />
        <CollectionAssociatedPeople collection={collection} title="Associated people" />
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
      tags {
        __typename
        ... on CollectionDatabase {
          citation {
            ...ModelLink_model
          }
          comment
        }
        ... on TypeCatalog {
          citation {
            ...ModelLink_model
          }
          coverage
        }
      }
    }
  `,
});
