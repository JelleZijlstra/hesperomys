import { NameTypeTags_name } from "./__generated__/NameTypeTags_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";
import InlineMarkdown from "./InlineMarkdown";
import CoordinatesLink from "./CoordinatesLink";
import TypeLocalityLink from "./TypeLocalityLink";

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
    case "PartialTypeLocalityN":
      return (
        <>
          Part of the type locality: <TypeLocalityLink location={tag.location} />
        </>
      );
    case "StructuredVerbatimCitationN": {
      const parts = [
        tag.series && `series ${tag.series}`,
        tag.volume && `volume ${tag.volume}`,
        tag.issue && `issue ${tag.issue}`,
        tag.startPage &&
          `page${tag.endPage ? "s" : ""} ${tag.startPage}${
            tag.endPage ? `–${tag.endPage}` : ""
          }`,
      ].filter(Boolean);
      return (
        <>
          Citation as given: {parts.join(", ")}
          {tag.citationUrl && (
            <>
              {parts.length > 0 && "; "}
              <a href={tag.citationUrl}>source link</a>
            </>
          )}
        </>
      );
    }
    case "AgeN":
      return <>Age of the type specimen: {tag.age}</>;
    case "AltitudeN":
      return (
        <>
          Altitude of the type locality: {tag.altitude} {tag.unit}
        </>
      );
    case "CitationDetailN":
      return <Detail text={tag.text} source={tag.source} />;
    case "CollectionDetailN":
      return <Detail text={tag.text} source={tag.source} />;
    case "CollectedByN":
      return (
        <>
          Collected by <ModelLink model={tag.person} />
        </>
      );
    case "InvolvedN":
      return (
        <>
          Involved: <ModelLink model={tag.person} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "CommissionTypeDesignationN":
      if (!tag.opinion || !tag.type) {
        return null;
      }
      return (
        <>
          Type designated by the Commission as <ModelLink model={tag.type} /> in{" "}
          <ModelLink model={tag.opinion} />
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
        </>
      );
    case "CoordinatesN":
      return (
        <>
          Coordinates:{" "}
          <CoordinatesLink
            latitude={tag.latitude}
            longitude={tag.longitude}
            openstreetmapUrl={tag.openstreetmapUrl}
          />
        </>
      );
    case "DateN":
      return <>Date of collection: {tag.date}</>;
    case "DefinitionDetailN":
      return <Detail text={tag.text} source={tag.source} />;
    case "DescriptionDetailN":
      return (
        <>
          Description: <Detail text={tag.text} source={tag.source} />
        </>
      );
    case "EtymologyDetailN":
      return (
        <>
          Etymology: <Detail text={tag.text} source={tag.source} />
        </>
      );
    case "NomenclatureDetailN":
      return (
        <>
          Nomenclature: <Detail text={tag.text} source={tag.source} />
        </>
      );
    case "GenderN":
      return <>Gender of the type specimen: {tag.gender}</>;
    case "GenusCoelebsN":
      return (
        <>
          The genus did not include any species when originally named.
          {tag.comments && " Commments: " + tag.comments}
        </>
      );
    case "HabitatN":
      return <>Type habitat: {tag.text}</>;
    case "HostN":
      return <>Type host: {tag.hostName}</>;
    case "IncludedSpeciesN":
      return (
        <>
          Originally included species: <ModelLink model={tag.name} />
          {(tag.includedPage || tag.pageLink) && (
            <>
              {" ("}
              {tag.includedPage && <>page {tag.includedPage}</>}
              {tag.includedPage && tag.pageLink && "; "}
              {tag.pageLink && <a href={tag.pageLink}>view page</a>}
              {")"}
            </>
          )}
          {!tag.includedPage &&
            !tag.pageLink &&
            tag.comment &&
            ` (comment: ${tag.comment})`}
          {tag.comment &&
            (tag.includedPage || tag.pageLink) &&
            ` (comment: ${tag.comment})`}
        </>
      );
    case "LectotypeDesignationN":
      return (
        <>
          Lectotype designated by{" "}
          {tag.optionalSource ? (
            <ModelLink model={tag.optionalSource} />
          ) : (
            "(reference not seen)"
          )}
          : {tag.lectotype}.
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
          {tag.comment && (
            <>
              {" "}
              Comment: <InlineMarkdown source={tag.comment} />
            </>
          )}
        </>
      );
    case "NeotypeDesignationN":
      return (
        <>
          Neotype designated by{" "}
          {tag.optionalSource ? (
            <ModelLink model={tag.optionalSource} />
          ) : (
            "(reference not seen)"
          )}
          : {tag.neotype}.
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
          {tag.comment && (
            <>
              {" "}
              Comment: <InlineMarkdown source={tag.comment} />
            </>
          )}
        </>
      );
    case "LocationDetailN":
      return (
        <>
          <Detail text={tag.text} source={tag.source} />
          {tag.localityPage && <> (page {tag.localityPage})</>}
          {tag.translation && <> Translation: {tag.translation}</>}
          {tag.localityComment && (
            <>
              ; <InlineMarkdown source={tag.localityComment} />
            </>
          )}
          {tag.classificationEntry && (
            <>
              ; source entry: <ModelLink model={tag.classificationEntry} />
            </>
          )}
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
        </>
      );
    case "OrganN":
      return (
        <>
          The type specimen includes: {tag.organ}.
          {tag.detail && ` Detail: ${tag.detail}.`}
          {tag.condition && ` Condition: ${tag.condition}.`}
        </>
      );
    case "InternalSpecifierN":
      return (
        <>
          Internal specifier: <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "ExternalSpecifierN":
      return (
        <>
          External specifier: <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "MustBePartOfN":
      return (
        <>
          Must be part of <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "MustNotIncludeN":
      return (
        <>
          Must not include <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "MustNotBePartOfN":
      return (
        <>
          Must not be part of <ModelLink model={tag.name} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "MustBeExtinctN":
      return <>Must be extinct{tag.comment ? ` (comment: ${tag.comment})` : ""}</>;
    case "ProbableRepositoryN":
      return (
        <>
          The type is probably in <ModelLink model={tag.repository} />.
          {tag.reasoning && `Reasoning: ${tag.reasoning}`}
        </>
      );
    case "GuessedRepositoryN":
      return (
        <>
          Type may be in <ModelLink model={tag.repository} /> (guessed by an algorithm
          based on similar names; score: {tag.score.toFixed(3)}; higher scores indicate
          more confidence).
        </>
      );
    case "RepositoryN":
      return (
        <>
          Part of the type material is in <ModelLink model={tag.repository} />.
        </>
      );
    case "FormerRepositoryN":
      return (
        <>
          The type material was formerly in <ModelLink model={tag.repository} />.
        </>
      );
    case "FutureRepositoryN":
      return (
        <>
          The type material is expected to be transferred to{" "}
          <ModelLink model={tag.repository} />.
        </>
      );
    case "ExtraRepositoryN":
      return (
        <>
          Additional material from the type specimen is in{" "}
          <ModelLink model={tag.repository} />.
        </>
      );
    case "SourceDetailN":
      return <Detail text={tag.text} source={tag.source} />;
    case "SpecimenDetailN":
      return (
        <>
          <Detail text={tag.text} source={tag.source} />
          {tag.classificationEntry && (
            <>
              ; source entry: <ModelLink model={tag.classificationEntry} />
            </>
          )}
        </>
      );
    case "AdditionalTypeSpecimenN":
      return (
        <>
          Additional specimen ({tag.kind.replace(/_/g, " ")}): {tag.text}
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "StratigraphyDetailN":
      return <>Stratigraphy: {tag.text}</>;
    case "TypeDesignationN":
      return (
        <>
          Type species designated by{" "}
          {tag.optionalSource ? (
            <ModelLink model={tag.optionalSource} />
          ) : (
            "(reference not seen)"
          )}
          : <ModelLink model={tag.type} />.{tag.comment && ` Comment: ${tag.comment}`}
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
        </>
      );
    case "TypeSpeciesDetailN":
      return <Detail text={tag.text} source={tag.source} />;
    case "PhylogeneticDefinitionN":
      return (
        <>
          Phylogenetic definition ({tag.definitionType.replace(/_/g, " ")}):{" "}
          <ModelLink model={tag.source} />
          {tag.comment && ` (comment: ${tag.comment})`}
        </>
      );
    case "TypeSpecimenLinkN":
      if (!tag.url) {
        return null;
      }
      return (
        <>
          Collection database entry for type specimen: <a href={tag.url}>{tag.url}</a>
        </>
      );
    case "TypeSpecimenLinkForN":
      if (!tag.url) {
        return null;
      }
      return (
        <>
          Collection database entry for type specimen {tag.specimen}:{" "}
          <a href={tag.url}>{tag.url}</a>
        </>
      );
    case "NamedAfterN":
      return (
        <>
          Named after <ModelLink model={tag.person} />
        </>
      );
    case "TextualOriginalRankN":
      return <>Original rank: {tag.text}</>;
    case "LSIDN":
      const url = `https://zoobank.org/NomenclaturalActs/${tag.text}`;
      const label = `urn:lsid:zoobank.org:act:${tag.text}`;
      return (
        <>
          LSID (ZooBank): <a href={url}>{label}</a>
        </>
      );
    case "AuthorityPageLinkN":
      return (
        <>
          View original description (page {tag.page}): <a href={tag.url}>{tag.url}</a>
        </>
      );
    case "PhyloCodeNumberN":
      return <>PhyloCode registration number: {tag.number}</>;
    case "TypeLocalityValidityN":
      return (
        <>
          Type-locality validity: {tag.validity.replace(/_/g, " ")}
          {tag.comment && ` (${tag.comment})`}
        </>
      );
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
          (tag, index) =>
            tag && (
              <li key={`${tag.__typename}-${index}`}>
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
        ... on PartialTypeLocalityN {
          location {
            ...TypeLocalityLink_location
          }
        }
        ... on StructuredVerbatimCitationN {
          series
          volume
          issue
          startPage
          endPage
          citationUrl: url
        }
        ... on AgeN {
          age
        }
        ... on AltitudeN {
          altitude
          unit
        }
        ... on CitationDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on CollectionDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on InvolvedN {
          person {
            ...ModelLink_model
          }
          comment
        }
        ... on CollectedByN {
          person {
            ...ModelLink_model
          }
        }
        ... on CommissionTypeDesignationN {
          opinion {
            ...ModelLink_model
          }
          type {
            ...ModelLink_model
          }
          pageLink
        }
        ... on CoordinatesN {
          latitude
          longitude
          openstreetmapUrl
        }
        ... on DateN {
          date
        }
        ... on DefinitionDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on DescriptionDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on EtymologyDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on NomenclatureDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on GenderN {
          gender
        }
        ... on GenusCoelebsN {
          comments
        }
        ... on HabitatN {
          text
        }
        ... on HostN {
          hostName: name
        }
        ... on IncludedSpeciesN {
          name {
            ...ModelLink_model
          }
          comment
          includedPage: page
          pageLink
        }
        ... on LectotypeDesignationN {
          optionalSource {
            ...ModelLink_model
          }
          lectotype
          valid
          comment
          pageLink
        }
        ... on LocationDetailN {
          text
          localityPage: page
          translation
          localityComment: comment
          classificationEntry {
            ...ModelLink_model
          }
          source {
            ...ModelLink_model
          }
          pageLink
        }
        ... on NeotypeDesignationN {
          optionalSource {
            ...ModelLink_model
          }
          neotype
          valid
          comment
          pageLink
        }
        ... on OrganN {
          organ
          detail
          condition
        }
        ... on ProbableRepositoryN {
          repository {
            ...ModelLink_model
          }
          reasoning
        }
        ... on InternalSpecifierN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on ExternalSpecifierN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MustBePartOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MustNotBePartOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MustNotIncludeN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MustBeExtinctN {
          comment
        }
        ... on GuessedRepositoryN {
          repository {
            ...ModelLink_model
          }
          score
        }
        ... on RepositoryN {
          repository {
            ...ModelLink_model
          }
        }
        ... on FormerRepositoryN {
          repository {
            ...ModelLink_model
          }
        }
        ... on FutureRepositoryN {
          repository {
            ...ModelLink_model
          }
        }
        ... on ExtraRepositoryN {
          repository {
            ...ModelLink_model
          }
        }
        ... on SourceDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on SpecimenDetailN {
          text
          classificationEntry {
            ...ModelLink_model
          }
          source {
            ...ModelLink_model
          }
        }
        ... on AdditionalTypeSpecimenN {
          text
          kind
          comment
        }
        ... on StratigraphyDetailN {
          text
        }
        ... on TypeDesignationN {
          optionalSource {
            ...ModelLink_model
          }
          type {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on TypeSpeciesDetailN {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on PhylogeneticDefinitionN {
          definitionType: type
          source {
            ...ModelLink_model
          }
          comment
        }
        ... on NamedAfterN {
          person {
            ...ModelLink_model
          }
        }
        ... on TextualOriginalRankN {
          text
        }
        ... on LSIDN {
          text
        }
        ... on TypeSpecimenLinkN {
          url
        }
        ... on TypeSpecimenLinkForN {
          url
          specimen
        }
        ... on AuthorityPageLinkN {
          url
          page
        }
        ... on PhyloCodeNumberN {
          number
        }
        ... on TypeLocalityValidityN {
          validity
          comment
        }
      }
    }
  `,
});
