import { Title_model } from "./__generated__/Title_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ArticleTitle from "./ArticleTitle";
import ArticleCommentTitle from "./ArticleCommentTitle";
import CitationGroupTitle from "./CitationGroupTitle";
import CitationGroupPatternTitle from "./CitationGroupPatternTitle";
import CollectionTitle from "./CollectionTitle";
import LocationTitle from "./LocationTitle";
import StratigraphicUnitTitle from "./StratigraphicUnitTitle";
import NameTitle from "./NameTitle";
import NameCommentTitle from "./NameCommentTitle";
import NameComplexTitle from "./NameComplexTitle";
import NameEndingTitle from "./NameEndingTitle";
import OccurrenceTitle from "./OccurrenceTitle";
import PeriodTitle from "./PeriodTitle";
import RegionTitle from "./RegionTitle";
import SpeciesNameComplexTitle from "./SpeciesNameComplexTitle";
import SpeciesNameEndingTitle from "./SpeciesNameEndingTitle";
import TaxonTitle from "./TaxonTitle";

class Title extends React.Component<{ model: Title_model }> {
  render() {
    const { model } = this.props;
    switch (model.__typename) {
      case "Article":
        return <ArticleTitle article={model} />;
      case "ArticleComment":
        return <ArticleCommentTitle articleComment={model} />;
      case "CitationGroup":
        return <CitationGroupTitle citationGroup={model} />;
      case "CitationGroupPattern":
        return <CitationGroupPatternTitle citationGroupPattern={model} />;
      case "Collection":
        return <CollectionTitle collection={model} />;
      case "Location":
        return <LocationTitle location={model} />;
      case "Name":
        return <NameTitle name={model} />;
      case "NameComment":
        return <NameCommentTitle nameComment={model} />;
      case "NameComplex":
        return <NameComplexTitle nameComplex={model} />;
      case "NameEnding":
        return <NameEndingTitle nameEnding={model} />;
      case "Occurrence":
        return <OccurrenceTitle occurrence={model} />;
      case "Period":
        return <PeriodTitle period={model} />;
      case "Region":
        return <RegionTitle region={model} />;
      case "SpeciesNameComplex":
        return <SpeciesNameComplexTitle speciesNameComplex={model} />;
      case "SpeciesNameEnding":
        return <SpeciesNameEndingTitle speciesNameEnding={model} />;
      case "Taxon":
        return <TaxonTitle taxon={model} />;
      case "StratigraphicUnit":
        return <StratigraphicUnitTitle stratigraphicUnit={model} />;
      default:
        return <>(unimplemented for {model.__typename})</>;
    }
  }
}

export default createFragmentContainer(Title, {
  model: graphql`
    fragment Title_model on Model {
      __typename
      ...ArticleTitle_article
      ...ArticleCommentTitle_articleComment
      ...CitationGroupTitle_citationGroup
      ...CitationGroupPatternTitle_citationGroupPattern
      ...CollectionTitle_collection
      ...LocationTitle_location
      ...NameTitle_name
      ...StratigraphicUnitTitle_stratigraphicUnit
      ...NameCommentTitle_nameComment
      ...NameComplexTitle_nameComplex
      ...NameEndingTitle_nameEnding
      ...OccurrenceTitle_occurrence
      ...PeriodTitle_period
      ...RegionTitle_region
      ...SpeciesNameComplexTitle_speciesNameComplex
      ...SpeciesNameEndingTitle_speciesNameEnding
      ...TaxonTitle_taxon
    }
  `,
});
