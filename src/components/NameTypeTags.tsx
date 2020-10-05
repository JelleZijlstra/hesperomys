import { NameTypeTags_name } from "./__generated__/NameTypeTags_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";

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
    case "Collector":
      return <>Collected by {tag.collector}</>;
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
    case "EtymologyDetail":
      return <Detail text={tag.text} source={tag.source} />;
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
          Lectotype designated by <ModelLink model={tag.source} />:{" "}
          {tag.lectotype}.{tag.comment && " Comment: " + tag.comment}
        </>
      );
    case "NeotypeDesignation":
      return (
        <>
          Neotype designated by <ModelLink model={tag.source} />: {tag.neotype}.
          {tag.comment && " Comment: " + tag.comment}
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
    case "ProbableRepository":
      return (
        <>
          The type is probably in <ModelLink model={tag.repository} />.
          {tag.reasoning && `Reasoning: ${tag.reasoning}`}
        </>
      );
    case "Repository":
      return (
        <>
          Part of the type material is in <ModelLink model={tag.repository} />.
        </>
      );
    case "SpecimenDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "StratigraphyDetail":
      return <>Stratigraphy: {tag.text}</>;
    case "TypeDesignation":
      return (
        <>
          Type species designated by <ModelLink model={tag.source} />:{" "}
          <ModelLink model={tag.type} />.
          {tag.comment && ` Comment: ${tag.comment}`}
        </>
      );
    case "TypeSpeciesDetail":
      return <Detail text={tag.text} source={tag.source} />;
    case "NamedAfter":
      return (
        <>
          Named after <ModelLink model={tag.person} />
        </>
      );
    default:
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
      (tag) => tag && (!tagsToInclude || tagsToInclude.includes(tag.__typename))
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
            )
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
        ... on Collector {
          collector: name
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
        ... on EtymologyDetail {
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
          source {
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
          source {
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
        ... on Repository {
          repository {
            ...ModelLink_model
          }
        }
        ... on SpecimenDetail {
          text
          source {
            ...ModelLink_model
          }
        }
        ... on StratigraphyDetail {
          text
        }
        ... on TypeDesignation {
          source {
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
        ... on NamedAfter {
          person {
            ...ModelLink_model
          }
        }
      }
    }
  `,
});
