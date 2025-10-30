import { NameTypeTags_name } from "./__generated__/NameTypeTags_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";
import InlineMarkdown from "./InlineMarkdown";

type TypeTag_tag = Exclude<NameTypeTags_name["typeTags"][0], null>;

export function Detail({ text, source }: { text: string | null; source: any }) {
  if (!text) {
    return null;
  }
  return (
    <>
      "{text}"
      {source && (
        <>
          {" "}
          (<ModelLink model={source} />)
        </>
      )}
    </>
  );
}

function TypeTag({ tag }: { tag: TypeTag_tag }) {
  switch (tag.__typename) {
    case "Age":
      return <>Age of the type specimen: {tag.age}</>;
    case "Altitude":
      return (
        <>
          Altitude of the type locality: {tag.altitude} {tag.unit}
        </>
      );
    case "CitationDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "CollectionDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "CollectedBy":
      return (
        <>
          Collected by <ModelLink model={tag.person} />
        </>
      );
    case "Involved":
      return (
        <>
          Involved: <ModelLink model={tag.person} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "CommissionTypeDesignation":
      if (!tag.opinion || !tag.type) {
        return null;
      }
      return (
        <>
          Type designated by the Commission as <ModelLink model={tag.type} /> in{" "}
          <ModelLink model={tag.opinion} />
        </>
      );
    case "Coordinates":
      return (
        <>
          Coordinates: {tag.latitude} {tag.longitude}
        </>
      );
    case "Date":
      return <>Date of collection: {tag.date}</>;
    case "DefinitionDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "DescriptionDetail":
      return (
        <>
          Description: <Detail text={tag.text} source={tag.source} />
        </>
      );
    case "EtymologyDetail":
      return (
        <>
          Etymology: <Detail text={tag.text} source={tag.source} />
        </>
      );
    case "NomenclatureDetail":
      return (
        <>
          Nomenclature: <Detail text={tag.text} source={tag.source} />
        </>
      );
    case "Gender":
      return <>Gender of the type specimen: {tag.gender}</>;
    case "GenusCoelebs":
      return (
        <>
          The genus did not include any species when originally named.
          {tag.comments && " Commments: " + tag.comments}
        </>
      );
    case "Habitat":
      return <>Type habitat: {tag.text}</>;
    case "Host":
      return <>Type host: {tag.hostName}</>;
    case "IncludedSpecies":
      return (
        <>
          Originally included species: <ModelLink model={tag.name} />
          {tag.comment && " (comment: " + tag.comment + ")"}
        </>
      );
    case "LectotypeDesignation":
      return (
        <>
          Lectotype designated by{" "}
          {tag.optionalSource ? (
            <ModelLink model={tag.optionalSource} />
          ) : (
            "(reference not seen)"
          )}
          : {tag.lectotype}.
          {tag.comment && (
            <>
              {" "}
              Comment: <InlineMarkdown source={tag.comment} />
            </>
          )}
        </>
      );
    case "NeotypeDesignation":
      return (
        <>
          Neotype designated by{" "}
          {tag.optionalSource ? (
            <ModelLink model={tag.optionalSource} />
          ) : (
            "(reference not seen)"
          )}
          : {tag.neotype}.
          {tag.comment && (
            <>
              {" "}
              Comment: <InlineMarkdown source={tag.comment} />
            </>
          )}
        </>
      );
    case "LocationDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "Organ":
      return (
        <>
          The type specimen includes: {tag.organ}.
          {tag.detail && ` Detail: ${tag.detail}.`}
          {tag.condition && ` Condition: ${tag.condition}.`}
        </>
      );
    case "InternalSpecifier":
      return (
        <>
          Internal specifier: <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "ExternalSpecifier":
      return (
        <>
          External specifier: <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "MustBePartOf":
      return (
        <>
          Must be part of <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "MustNotInclude":
      return (
        <>
          Must not include <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "MustBeExtinct":
      return <>Must be extinct{tag.comment ? ` (comment: ${tag.comment})` : ""}</>;
    case "ProbableRepository":
      return (
        <>
          The type is probably in <ModelLink model={tag.repository} />.
          {tag.reasoning && `Reasoning: ${tag.reasoning}`}
        </>
      );
    case "GuessedRepository":
      return (
        <>
          Type may be in <ModelLink model={tag.repository} /> (guessed by an algorithm
          based on similar names; score: {tag.score.toFixed(3)}; higher scores indicate
          more confidence).
        </>
      );
    case "Repository":
      return (
        <>
          Part of the type material is in <ModelLink model={tag.repository} />.
        </>
      );
    case "FormerRepository":
      return (
        <>
          The type material was formerly in <ModelLink model={tag.repository} />.
        </>
      );
    case "FutureRepository":
      return (
        <>
          The type material is expected to be transferred to{" "}
          <ModelLink model={tag.repository} />.
        </>
      );
    case "ExtraRepository":
      return (
        <>
          Additional material from the type specimen is in{" "}
          <ModelLink model={tag.repository} />.
        </>
      );
    case "SourceDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "SpecimenDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "AdditionalTypeSpecimen":
      return (
        <>
          Additional specimen ({tag.kind.replace(/_/g, " ")}): {tag.text}
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "StratigraphyDetail":
      return <>Stratigraphy: {tag.text}</>;
    case "TypeDesignation":
      return (
        <>
          Type species designated by{" "}
          {tag.optionalSource ? (
            <ModelLink model={tag.optionalSource} />
          ) : (
            "(reference not seen)"
          )}
          : <ModelLink model={tag.type} />.{tag.comment && ` Comment: ${tag.comment}`}
        </>
      );
    case "TypeSpeciesDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "PhylogeneticDefinition":
      return (
        <>
          Phylogenetic definition ({tag.definitionType.replace(/_/g, " ")}):{" "}
          <ModelLink model={tag.source} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "TypeSpecimenLink":
      if (!tag.url) {
        return null;
      }
      return (
        <>
          Collection database entry for type specimen: <a href={tag.url}>{tag.url}</a>
        </>
      );
    case "TypeSpecimenLinkFor":
      if (!tag.url) {
        return null;
      }
      return (
        <>
          Collection database entry for type specimen {tag.specimen}:{" "}
          <a href={tag.url}>{tag.url}</a>
        </>
      );
    case "NamedAfter":
      return (
        <>
          Named after <ModelLink model={tag.person} />
        </>
      );
    case "TextualOriginalRank":
      return <>Original rank: {tag.text}</>;
    case "LSIDName":
      const url = `https://zoobank.org/NomenclaturalActs/${tag.text}`;
      const label = `urn:lsid:zoobank.org:act:${tag.text}`;
      return (
        <>
          LSID (ZooBank): <a href={url}>{label}</a>
        </>
      );
    case "AuthorityPageLink":
      return (
        <>
          View original description (page {tag.page}): <a href={tag.url}>{tag.url}</a>
        </>
      );
    case "PhyloCodeNumber":
      return <>PhyloCode registration number: {tag.number}</>;
    default:
      console.log(tag.__typename);
      return null;
  }
}

class NameTypeTags extends React.Component<{
  name: NameTypeTags_name;
  tagsToInclude?: string[];
}> {
  render() {
    const { name, tagsToInclude } = this.props;
    if (!name.typeTags || name.typeTags.length === 0) {
      return null;
    }
    const typeTags = name.typeTags.filter(
      (tag) => tag && (!tagsToInclude || tagsToInclude.includes(tag.__typename)),
    );
    if (typeTags.length === 0) {
      return null;
    }
    return (
      <ul>
        {typeTags.map(
          (tag) =>
            tag && (
              <li key={tag.__typename}>
                <TypeTag tag={tag} />
              </li>
            ),
        )}
      </ul>
    );
  }
}

export default createFragmentContainer(NameTypeTags, {
  name: graphql`
    fragment NameTypeTags_name on Name {
      typeTags {
        __typename
        ... on Age {
          age
        }
        ... on Altitude {
          altitude
          unit
        }
        ... on CitationDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on CollectionDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on Involved {
          person {
            ...ModelLink_model
          }
          comment
        }
        ... on CollectedBy {
          person {
            ...ModelLink_model
          }
        }
        ... on CommissionTypeDesignation {
          opinion {
            ...ModelLink_model
          }
          type {
            ...ModelLink_model
          }
        }
        ... on Coordinates {
          latitude
          longitude
        }
        ... on Date {
          date
        }
        ... on DefinitionDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on DescriptionDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on EtymologyDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on NomenclatureDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on Gender {
          gender
        }
        ... on GenusCoelebs {
          comments
        }
        ... on Habitat {
          text
        }
        ... on Host {
          hostName: name
        }
        ... on IncludedSpecies {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on LectotypeDesignation {
          optionalSource {
            ...ModelLink_model
          }
          lectotype
          valid
          comment
        }
        ... on LocationDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on NeotypeDesignation {
          optionalSource {
            ...ModelLink_model
          }
          neotype
          valid
          comment
        }
        ... on Organ {
          organ
          detail
          condition
        }
        ... on ProbableRepository {
          repository {
            ...ModelLink_model
          }
          reasoning
        }
        ... on InternalSpecifier {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on ExternalSpecifier {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MustBePartOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MustNotInclude {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MustBeExtinct {
          comment
        }
        ... on GuessedRepository {
          repository {
            ...ModelLink_model
          }
          score
        }
        ... on Repository {
          repository {
            ...ModelLink_model
          }
        }
        ... on FormerRepository {
          repository {
            ...ModelLink_model
          }
        }
        ... on FutureRepository {
          repository {
            ...ModelLink_model
          }
        }
        ... on ExtraRepository {
          repository {
            ...ModelLink_model
          }
        }
        ... on SourceDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on SpecimenDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on AdditionalTypeSpecimen {
          text
          kind
          comment
        }
        ... on StratigraphyDetail {
          text
        }
        ... on TypeDesignation {
          optionalSource {
            ...ModelLink_model
          }
          type {
            ...ModelLink_model
          }
          comment
        }
        ... on TypeSpeciesDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on PhylogeneticDefinition {
          definitionType: type
          source {
            ...ModelLink_model
          }
          comment
        }
        ... on NamedAfter {
          person {
            ...ModelLink_model
          }
        }
        ... on TextualOriginalRank {
          text
        }
        ... on LSIDName {
          text
        }
        ... on TypeSpecimenLink {
          url
        }
        ... on TypeSpecimenLinkFor {
          url
          specimen
        }
        ... on AuthorityPageLink {
          url
          page
        }
        ... on PhyloCodeNumber {
          number
        }
      }
    }
  `,
});
