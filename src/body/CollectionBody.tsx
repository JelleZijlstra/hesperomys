import { CollectionBody_collection } from "./__generated__/CollectionBody_collection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CollectionChildren from "../lists/CollectionChildren";
import CollectionTypeSpecimens from "../lists/CollectionTypeSpecimens";
import CollectionFormerSpecimens from "../lists/CollectionFormerSpecimens";
import CollectionFutureSpecimens from "../lists/CollectionFutureSpecimens";
import CollectionProbableSpecimens from "../lists/CollectionProbableSpecimens";
import CollectionSharedSpecimens from "../lists/CollectionSharedSpecimens";
import CollectionAssociatedPeople from "../lists/CollectionAssociatedPeople";
import ModelLink from "../components/ModelLink";
import CollectionExtraSpecimens from "../lists/CollectionExtraSpecimens";

type CollectionTag = Exclude<CollectionBody_collection["tags"][0], null>;

function SingleTag({ tag }: { tag: CollectionTag }) {
  switch (tag.__typename) {
    case "CollectionDatabase":
      return (
        <li key={`${tag.__typename}-${tag.citation.name}`}>
          Online collection database: <ModelLink model={tag.citation} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </li>
      );
    case "TypeCatalog":
      return (
        <li key={`${tag.__typename}-${tag.citation.name}`}>
          Type catalog: <ModelLink model={tag.citation} />
          {tag.coverage && ` (coverage: ${tag.coverage})`}
        </li>
      );
  }
  return null;
}

function Tags({
  collection: { tags, parent },
}: {
  collection: CollectionBody_collection;
}) {
  if (!tags || tags.length === 0) {
    return null;
  }
  return (
    <ul>
      {parent !== null && (
        <li key="parent">
          Parent collection: <ModelLink model={parent} />
        </li>
      )}
      {tags.map((tag) => (
        <SingleTag tag={tag} />
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
        <CollectionChildren collection={collection} title="Subcollections" />
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
        <CollectionFormerSpecimens
          collection={collection}
          title="Former type specimens"
          subtitle={<p>These type specimens were formerly in this collection.</p>}
        />
        <CollectionFutureSpecimens
          collection={collection}
          title="Future type specimens"
          subtitle={
            <p>
              These type specimens are expected to be moved to this collection in the
              future.
            </p>
          }
        />
        <CollectionExtraSpecimens
          collection={collection}
          title="Extra type specimens"
          subtitle={
            <p>Some material from these type specimens is in this collection.</p>
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
      ...CollectionFormerSpecimens_collection
      ...CollectionExtraSpecimens_collection
      ...CollectionFutureSpecimens_collection
      ...CollectionProbableSpecimens_collection
      ...CollectionAssociatedPeople_collection
      ...CollectionChildren_collection
      numChildren
      parent {
        ...ModelLink_model
      }
      tags {
        __typename
        ... on CollectionDatabase {
          citation {
            ...ModelLink_model
            name
          }
          comment
        }
        ... on TypeCatalog {
          citation {
            ...ModelLink_model
            name
          }
          coverage
        }
      }
    }
  `,
});
