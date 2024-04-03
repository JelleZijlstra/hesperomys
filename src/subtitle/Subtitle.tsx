import { Subtitle_model } from "./__generated__/Subtitle_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import RegionSubtitle from "./RegionSubtitle";
import CollectionSubtitle from "./CollectionSubtitle";
import CitationGroupSubtitle from "./CitationGroupSubtitle";
import NameSubtitle from "./NameSubtitle";
import PeriodSubtitle from "./PeriodSubtitle";
import LocationSubtitle from "./LocationSubtitle";

const modelSpecific = function (model: Subtitle_model) {
  switch (model.__typename) {
    case "Name":
      return <NameSubtitle name={model} />;
    case "Period":
      return <PeriodSubtitle period={model} />;
    case "Region":
      return <RegionSubtitle region={model} />;
    case "Collection":
      return <CollectionSubtitle collection={model} />;
    case "CitationGroup":
      return <CitationGroupSubtitle citationGroup={model} />;
    case "Location":
      return <LocationSubtitle location={model} />;
    default:
      return null;
  }
};

const Subtitle = ({ model }: { model: Subtitle_model }) => {
  const start = modelSpecific(model);
  const href = model.modelCls.name
    .replace(/([a-z])([A-Z])/, (match) => `${match[0]}-${match[1].toLowerCase()}`)
    .toLowerCase();
  const docslink = (
    <>
      Documentation: <a href={`/docs/${href}`}>{model.modelCls.name}</a>
    </>
  );
  if (start) {
    return (
      <>
        {start} – {docslink}
      </>
    );
  } else {
    return docslink;
  }
};

export default createFragmentContainer(Subtitle, {
  model: graphql`
    fragment Subtitle_model on Model {
      __typename
      ...NameSubtitle_name
      ...CitationGroupSubtitle_citationGroup
      ...CollectionSubtitle_collection
      ...RegionSubtitle_region
      ...PeriodSubtitle_period
      ...LocationSubtitle_location
      modelCls {
        name
      }
    }
  `,
});
