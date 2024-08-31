import { NameBody_name } from "./__generated__/NameBody_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics from "../components/MaybeItalics";
import ModelLink from "../components/ModelLink";
import Reference from "../reference/Reference";
import Table from "../components/Table";
import NameTags from "../components/NameTags";
import NameTypeTags from "../components/NameTypeTags";
import TaxonContext from "../components/TaxonContext";
import AuthorList from "../components/AuthorList";
import NameTypifiedNames from "../lists/NameTypifiedNames";
import NamePreoccupiedNames from "../lists/NamePreoccupiedNames";
import NameUnjustifiedEmendations from "../lists/NameUnjustifiedEmendations";
import NameIncorrectSubsequentSpellings from "../lists/NameIncorrectSubsequentSpellings";
import NameMisidentifications from "../lists/NameMisidentifications";
import NameNominaNova from "../lists/NameNominaNova";
import NameVariants from "../lists/NameVariants";
import NameTakingPriority from "../lists/NameTakingPriority";
import NameNominaOblita from "../lists/NameNominaOblita";
import NameMandatoryChanges from "../lists/NameMandatoryChanges";
import NameIncorrectOriginalSpellings from "../lists/NameIncorrectOriginalSpellings";
import NameSubsequentUsages from "../lists/NameSubsequentUsages";
import NameSelectionsOfPriority from "../lists/NameSelectionsOfPriority";
import NameSelectionsOfSpelling from "../lists/NameSelectionsOfSpelling";
import NameReversalsOfPriority from "../lists/NameReversalsOfPriority";
import NameJustifiedEmendations from "../lists/NameJustifiedEmendations";
import NameDesignatedAsType from "../lists/NameDesignatedAsType";
import NameCommissionDesignatedAsType from "../lists/NameCommissionDesignatedAsType";
import NameComments from "../lists/NameComments";
import ReactMarkdown from "react-markdown";
import PublicationDate from "./PublicationDate";
import NameNameCombinations from "../lists/NameNameCombinations";
import NameJuniorPrimaryHomonyms from "../lists/NameJuniorPrimaryHomonyms";
import NameJuniorSecondaryHomonyms from "../lists/NameJuniorSecondaryHomonyms";
import NameClassificationEntries from "../lists/NameClassificationEntries";

function NameSection({ name }: { name: NameBody_name }) {
  const {
    group,
    rootName,
    originalName,
    correctedOriginalName,
    originalCitation,
    citationGroup,
  } = name;
  return (
    <>
      <h3>Name</h3>
      <Table
        data={[
          ["Root name", <MaybeItalics name={rootName} group={group} />],
          [
            "Original name",
            originalName ? <MaybeItalics name={originalName} group={group} /> : null,
          ],
          [
            "Normalized original name",
            correctedOriginalName && originalName !== correctedOriginalName ? (
              <MaybeItalics name={correctedOriginalName} group={group} />
            ) : null,
          ],
          ["Authors", <AuthorList authorTags={name.authorTags} />],
          ["Year", name.numericYear !== null ? String(name.numericYear) : null],
          [
            "Date",
            name.year &&
            (!name.numericYear || name.year !== String(name.numericYear)) ? (
              <PublicationDate date={name.year} />
            ) : null,
          ],
          ["Page described", name.pageDescribed],
          [
            "Original citation",
            originalCitation ? <Reference article={originalCitation} /> : null,
          ],
          [
            "Raw unverified citation",
            name.verbatimCitation ? (
              <ReactMarkdown children={name.verbatimCitation} />
            ) : null,
          ],
          ["Published in", citationGroup ? <ModelLink model={citationGroup} /> : null],
        ]}
      />
      <NameTypeTags
        name={name}
        tagsToInclude={[
          "CitationDetail",
          "SourceDetail",
          "DefinitionDetail",
          "AuthorityPageLink",
          "PhyloCodeNumber",
        ]}
      />
    </>
  );
}

function NomenclatureSection({ name }: { name: NameBody_name }) {
  const { nomenclatureStatus, originalRank, nameComplex, speciesNameComplex } = name;
  return (
    <>
      <h3>Nomenclature</h3>
      <Table
        data={[
          ["Status", nomenclatureStatus.replace(/_/g, " ")],
          ["Original rank", originalRank],
          ["Name complex", nameComplex ? <ModelLink model={nameComplex} /> : null],
          [
            "Name complex",
            speciesNameComplex ? <ModelLink model={speciesNameComplex} /> : null,
          ],
        ]}
      />
      <NameTags name={name} />
      <NameTypeTags
        name={name}
        tagsToInclude={[
          "EtymologyDetail",
          "NamedAfter",
          "TextualOriginalRank",
          "LSIDName",
        ]}
      />
    </>
  );
}

const GROUP_TO_TYPE = new Map([
  ["species", "Type specimen"],
  ["genus", "Type species"],
  ["family", "Type genus"],
]);

function TypeSection({ name }: { name: NameBody_name }) {
  const { group, typeSpecimen, collection, speciesTypeKind, genusTypeKind, nameType } =
    name;
  const typeTags = [
    "Age",
    "CollectedBy",
    "Date",
    "Gender",
    "GenusCoelebs",
    "Host",
    "IncludedSpecies",
    "FormerRepository",
    "ExtraRepository",
    "FutureRepository",
    "Repository",
    "CollectionDetail",
    "CommmissionTypeDesignation",
    "ProbableRepository",
    "GuessedRepository",
    "SpecimenDetail",
    "Organ",
    "LectotypeDesignation",
    "NeotypeDesignation",
    "TypeDesignation",
    "TypeSpecimenLink",
    "TypeSpecimenLinkFor",
  ];
  if (
    !typeSpecimen &&
    !collection &&
    !speciesTypeKind &&
    !nameType &&
    !genusTypeKind &&
    !hasAnyTypeTags(name, typeTags)
  ) {
    return null;
  }
  return (
    <>
      <h3>{GROUP_TO_TYPE.get(group) || "Type"}</h3>
      <Table
        data={[
          ["Type specimen", typeSpecimen],
          ["Collection", collection ? <ModelLink model={collection} /> : null],
          [
            "Kind of type specimen",
            speciesTypeKind ? speciesTypeKind.replace(/_/g, " ") : null,
          ],
          [
            GROUP_TO_TYPE.get(group) || "Type",
            nameType ? <ModelLink model={nameType} /> : null,
          ],
          ["Kind of type", genusTypeKind ? genusTypeKind.replace(/_/g, " ") : null],
        ]}
      />
      <NameTypeTags name={name} tagsToInclude={typeTags} />
    </>
  );
}

function LocationSection({ name }: { name: NameBody_name }) {
  if (name.group !== "species") {
    return null;
  }
  const { typeLocality } = name;
  const locationTags = [
    "Altitude",
    "Coordinates",
    "LocationDetail",
    "Habitat",
    "StratigraphyDetail",
  ];
  if (!typeLocality && !hasAnyTypeTags(name, locationTags)) {
    return null;
  }
  return (
    <>
      <h3>Type locality</h3>
      <Table
        data={[
          ["Type locality", typeLocality ? <ModelLink model={typeLocality} /> : null],
        ]}
      />
      <NameTypeTags name={name} tagsToInclude={locationTags} />
    </>
  );
}

function hasAnyTypeTags(name: NameBody_name, tags: string[]) {
  return name.typeTags.some((tag) => tags.includes(tag.__typename));
}

class NameBody extends React.Component<{ name: NameBody_name }> {
  render() {
    const { name } = this.props;

    return (
      <>
        <TaxonContext taxon={name.taxon} />
        <NameSection name={name} />
        <NomenclatureSection name={name} />
        <TypeSection name={name} />
        <LocationSection name={name} />

        <NameClassificationEntries name={name} title="Inclusion in classifications" />
        <NameNameCombinations name={name} title="Name combinations" />
        <NameUnjustifiedEmendations name={name} title="Unjustified emendations" />
        <NameIncorrectSubsequentSpellings
          name={name}
          title="Incorrect subsequent spellings"
        />
        <NameVariants name={name} title="Variants" />
        <NameMandatoryChanges name={name} title="Mandatory changes" />
        <NameIncorrectOriginalSpellings
          name={name}
          title="Incorrect original spellings"
        />
        <NameJustifiedEmendations name={name} title="Justified emendations" />

        <NameTypifiedNames name={name} title="Typified names" />
        <NameDesignatedAsType name={name} title="Type designations" />
        <NameCommissionDesignatedAsType
          name={name}
          title="Type designations by the Commission"
        />

        <NamePreoccupiedNames name={name} title="Preoccupied names" />
        <NameJuniorPrimaryHomonyms name={name} title="Junior primary homonyms" />
        <NameJuniorSecondaryHomonyms name={name} title="Junior secondary homonyms" />
        <NameNominaNova name={name} title="NameNominaNova" />
        <NameSubsequentUsages name={name} title="Subsequent usages" />
        <NameMisidentifications name={name} title="Misidentifications" />

        <NameTakingPriority name={name} title="Taking the priority of this name" />
        <NameNominaOblita name={name} title="Nomina oblita" />
        <NameSelectionsOfPriority name={name} title="Selected as having priority" />
        <NameSelectionsOfSpelling
          name={name}
          title="Selected as the correct spelling"
        />
        <NameReversalsOfPriority name={name} title="Reversals of priority" />
        <NameComments name={name} title="Comments" />
      </>
    );
  }
}

export default createFragmentContainer(NameBody, {
  name: graphql`
    fragment NameBody_name on Name {
      ...NameTypeTags_name
      typeTags {
        __typename
      }

      taxon {
        ...TaxonContext_taxon
      }

      originalName
      correctedOriginalName
      group
      rootName
      authorTags {
        ...AuthorList_authorTags
      }
      year
      numericYear
      pageDescribed
      originalCitation {
        ...Reference_article
      }
      verbatimCitation
      citationGroup {
        ...ModelLink_model
      }

      nomenclatureStatus
      originalRank
      nameComplex {
        ...ModelLink_model
      }
      speciesNameComplex {
        ...ModelLink_model
      }
      ...NameTags_name

      typeSpecimen
      collection {
        ...ModelLink_model
      }
      nameType: type {
        ...ModelLink_model
      }
      genusTypeKind
      speciesTypeKind

      typeLocality {
        ...ModelLink_model
      }
      ...NameClassificationEntries_name
      ...NameTypifiedNames_name
      ...NamePreoccupiedNames_name
      ...NameJuniorPrimaryHomonyms_name
      ...NameJuniorSecondaryHomonyms_name
      ...NameUnjustifiedEmendations_name
      ...NameIncorrectSubsequentSpellings_name
      ...NameNominaNova_name
      ...NameVariants_name
      ...NameTakingPriority_name
      ...NameNominaOblita_name
      ...NameMandatoryChanges_name
      ...NameMisidentifications_name
      ...NameNameCombinations_name
      ...NameIncorrectOriginalSpellings_name
      ...NameSubsequentUsages_name
      ...NameSelectionsOfPriority_name
      ...NameSelectionsOfSpelling_name
      ...NameReversalsOfPriority_name
      ...NameJustifiedEmendations_name
      ...NameDesignatedAsType_name
      ...NameCommissionDesignatedAsType_name
      ...NameComments_name
    }
  `,
});
