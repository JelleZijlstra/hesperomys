import { NameBody_name } from "./__generated__/NameBody_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics from "../components/MaybeItalics";
import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import NameTags from "../components/NameTags";
import NameTypeTags from "../components/NameTypeTags";
import TaxonContext from "../components/TaxonContext";

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
            originalName ? (
              <MaybeItalics name={originalName} group={group} />
            ) : null,
          ],
          [
            "Cleaned original name",
            correctedOriginalName && originalName !== correctedOriginalName ? (
              <MaybeItalics name={correctedOriginalName} group={group} />
            ) : null,
          ],
          ["Author", name.authority],
          ["Year", name.year],
          ["Page described", name.pageDescribed],
          [
            "Original citation",
            originalCitation ? <ModelLink model={originalCitation} /> : null,
          ],
          [
            "Published in",
            citationGroup ? <ModelLink model={citationGroup} /> : null,
          ],
        ]}
      />
      <NameTypeTags
        name={name}
        tagsToInclude={["CitationDetail", "DefinitionDetail"]}
      />
    </>
  );
}

function NomenclatureSection({ name }: { name: NameBody_name }) {
  const { nomenclatureStatus, nameComplex, speciesNameComplex } = name;
  return (
    <>
      <h3>Nomenclature</h3>
      <Table
        data={[
          ["Status", nomenclatureStatus],
          [
            "Name complex",
            nameComplex ? <ModelLink model={nameComplex} /> : null,
          ],
          [
            "Name complex",
            speciesNameComplex ? (
              <ModelLink model={speciesNameComplex} />
            ) : null,
          ],
        ]}
      />
      <NameTags name={name} />
      <NameTypeTags
        name={name}
        tagsToInclude={["EtymologyDetail", "NamedAfter"]}
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
  const {
    group,
    typeSpecimen,
    collection,
    speciesTypeKind,
    genusTypeKind,
    type,
  } = name;
  return (
    <>
      <h3>{GROUP_TO_TYPE.get(group) || "Type"}</h3>
      <Table
        data={[
          ["Type specimen", typeSpecimen],
          ["Collection", collection ? <ModelLink model={collection} /> : null],
          ["Kind of type specimen", speciesTypeKind],
          [
            GROUP_TO_TYPE.get(group) || "Type",
            type ? <ModelLink model={type} /> : null,
          ],
          ["Kind of type", genusTypeKind],
        ]}
      />
      <NameTypeTags
        name={name}
        tagsToInclude={[
          "Age",
          "CollectedBy",
          "Collector",
          "Date",
          "Gender",
          "GenusCoelebs",
          "Host",
          "IncludedSpecies",
          "Repository",
          "CollectionDetail",
          "CommmissionTypeDesignation",
          "ProbableRepository",
          "SpecimenDetail",
          "Organ",
          "LectotypeDesignation",
          "NeotypeDesignation",
          "TypeDesignation",
        ]}
      />
    </>
  );
}

function LocationSection({ name }: { name: NameBody_name }) {
  if (name.group !== "species") {
    return null;
  }
  const { typeLocality } = name;
  return (
    <>
      <h3>Type locality</h3>
      <Table
        data={[
          [
            "Type locality",
            typeLocality ? <ModelLink model={typeLocality} /> : null,
          ],
        ]}
      />
      <NameTypeTags
        name={name}
        tagsToInclude={[
          "Altitude",
          "Coordinates",
          "LocationDetail",
          "Habitat",
          "StratigraphyDetail",
        ]}
      />
    </>
  );
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
      </>
    );
  }
}

export default createFragmentContainer(NameBody, {
  name: graphql`
    fragment NameBody_name on Name {
      ...NameTypeTags_name

      taxon {
        ...TaxonContext_taxon
      }

      originalName
      correctedOriginalName
      group
      rootName
      authority
      year
      pageDescribed
      originalCitation {
        ...ModelLink_model
      }
      citationGroup {
        ...ModelLink_model
      }

      nomenclatureStatus
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
      type {
        ...ModelLink_model
      }
      genusTypeKind
      speciesTypeKind

      typeLocality {
        ...ModelLink_model
      }
    }
  `,
});
