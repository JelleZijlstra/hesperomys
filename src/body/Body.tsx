import { Body_model } from "./__generated__/Body_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import PeriodBody from "./PeriodBody";
import RegionBody from "./RegionBody";
import CitationGroupBody from "./CitationGroupBody";
import CitationGroupPatternBody from "./CitationGroupPatternBody";
import ArticleBody from "./ArticleBody";
import ArticleCommentBody from "./ArticleCommentBody";
import CollectionBody from "./CollectionBody";
import LocationBody from "./LocationBody";
import TaxonBody from "./TaxonBody";
import SpeciesNameComplexBody from "./SpeciesNameComplexBody";
import NameComplexBody from "./NameComplexBody";
import NameEndingBody from "./NameEndingBody";
import SpeciesNameEndingBody from "./SpeciesNameEndingBody";
import NameCommentBody from "./NameCommentBody";
import OccurrenceBody from "./OccurrenceBody";
import StratigraphicUnitBody from "./StratigraphicUnitBody";
import PersonBody from "./PersonBody";
import NameBody from "./NameBody";

class Body extends React.Component<{ model: Body_model }> {
  render() {
    const { model } = this.props;
    switch (model.__typename) {
      case "Name":
        return <NameBody name={model} />;
      case "Period":
        return <PeriodBody period={model} />;
      case "Region":
        return <RegionBody region={model} />;
      case "CitationGroup":
        return <CitationGroupBody citationGroup={model} />;
      case "CitationGroupPattern":
        return <CitationGroupPatternBody citationGroupPattern={model} />;
      case "Article":
        return <ArticleBody article={model} />;
      case "ArticleComment":
        return <ArticleCommentBody articleComment={model} />;
      case "Collection":
        return <CollectionBody collection={model} />;
      case "Location":
        return <LocationBody location={model} />;
      case "Taxon":
        return <TaxonBody taxon={model} />;
      case "SpeciesNameComplex":
        return <SpeciesNameComplexBody speciesNameComplex={model} />;
      case "NameComplex":
        return <NameComplexBody nameComplex={model} />;
      case "NameEnding":
        return <NameEndingBody nameEnding={model} />;
      case "SpeciesNameEnding":
        return <SpeciesNameEndingBody speciesNameEnding={model} />;
      case "NameComment":
        return <NameCommentBody nameComment={model} />;
      case "Occurrence":
        return <OccurrenceBody occurrence={model} />;
      case "StratigraphicUnit":
        return <StratigraphicUnitBody stratigraphicUnit={model} />;
      case "Person":
        return <PersonBody person={model} />;
      default:
        return <>(unimplemented for {model.__typename})</>;
    }
  }
}

export default createFragmentContainer(Body, {
  model: graphql`
    fragment Body_model on Model {
      __typename
      ...NameBody_name
      ...PersonBody_person
      ...OccurrenceBody_occurrence
      ...NameCommentBody_nameComment
      ...SpeciesNameEndingBody_speciesNameEnding
      ...NameEndingBody_nameEnding
      ...NameComplexBody_nameComplex
      ...SpeciesNameComplexBody_speciesNameComplex
      ...TaxonBody_taxon
      ...LocationBody_location
      ...CollectionBody_collection
      ...ArticleCommentBody_articleComment
      ...ArticleBody_article
      ...CitationGroupPatternBody_citationGroupPattern
      ...CitationGroupBody_citationGroup
      ...RegionBody_region
      ...PeriodBody_period
      ...StratigraphicUnitBody_stratigraphicUnit
    }
  `,
});
