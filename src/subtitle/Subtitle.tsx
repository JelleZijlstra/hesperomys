import { Subtitle_model } from "./__generated__/Subtitle_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import RegionSubtitle from "./RegionSubtitle";
import CollectionSubtitle from "./CollectionSubtitle";
import CitationGroupSubtitle from "./CitationGroupSubtitle";
import NameSubtitle from "./NameSubtitle";
import PeriodSubtitle from "./PeriodSubtitle";

class Subtitle extends React.Component<{ model: Subtitle_model }> {
  render() {
    const { model } = this.props;
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
      default:
        return null;
    }
  }
}

export default createFragmentContainer(Subtitle, {
  model: graphql`
    fragment Subtitle_model on Model {
      __typename
      ...NameSubtitle_name
      ...CitationGroupSubtitle_citationGroup
      ...CollectionSubtitle_collection
      ...RegionSubtitle_region
      ...PeriodSubtitle_period
    }
  `,
});
