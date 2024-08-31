import { ModelLink_model } from "./__generated__/ModelLink_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import Title from "../title/Title";
import ModelLinkNoExtra from "./ModelLinkNoExtra";
import OpenButton from "./OpenButton";
import ReactMarkdown from "react-markdown";

function PersonExtra({ model }: { model: ModelLink_model }) {
  const parts = [];
  if (model.birth || model.death) {
    parts.push((model.birth ?? "") + "–" + (model.death ?? ""));
  }
  if (model.bio) {
    parts.push(model.bio);
  }
  if (parts.length > 0) {
    return <> ({parts.join("; ")})</>;
  }
  return null;
}

function NameExtra({ model }: { model: ModelLink_model }) {
  if (!model.taxon || !model.status) {
    return null;
  }
  const parts: [string, JSX.Element][] = [];
  if (model.status !== "valid") {
    parts.push(["status", <>{model.status.replace("_", " ")}</>]);
  }
  if (model.correctedOriginalName !== model.taxon.validName) {
    parts.push([
      "validName",
      <>
        = <Title model={model.taxon} />
      </>,
    ]);
  }
  if (parts.length === 0) {
    return null;
  }
  return (
    <>
      {" "}
      (
      {parts.map((part, i) => (
        <React.Fragment key={part[0]}>
          {i > 0 && ", "}
          {part[1]}
        </React.Fragment>
      ))}
      )
    </>
  );
}

function LocationExtra({ model }: { model: ModelLink_model }) {
  if (!model.locationRegion || !model.minPeriod || !model.maxPeriod) {
    return null;
  }
  const { locationRegion, minPeriod, maxPeriod, stratigraphicUnit } = model;
  return (
    <>
      {" ("}
      {minPeriod.periodName === maxPeriod.periodName
        ? minPeriod.periodName
        : maxPeriod.periodName + "–" + minPeriod.periodName}
      {" of " + locationRegion.regionName}
      {stratigraphicUnit &&
        stratigraphicUnit.periodName !== "Recent" &&
        "; " + stratigraphicUnit.periodName}
      )
    </>
  );
}

function CommentExtra({ model }: { model: ModelLink_model }) {
  if (!model.date) {
    return null;
  }
  return (
    <>
      {model.source && (
        <>
          <ModelLinkNoExtra model={model.source} />
          {model.page && `: ${model.page}`}
          {"; "}
        </>
      )}
      {new Date(model.date * 1000).toDateString()}
    </>
  );
}

function isNumeric(str: string) {
  return !isNaN(str as any);
}

function ClassificationEntryExtra({
  model,
  context,
}: {
  model: ModelLink_model;
  context?: Context;
}) {
  if (!model.article) {
    return null;
  }
  return (
    <>
      {" "}
      {context === "Article" ? (
        model.page ? (
          isNumeric(model.page) ? (
            <>(p. {model.page})</>
          ) : (
            <>({model.page})</>
          )
        ) : null
      ) : (
        <>
          in <ModelLinkNoExtra model={model.article} />
          {model.page && `: ${model.page}`}
        </>
      )}
      {context !== "Name" && model.mappedName && (
        <>
          , identified with <ModelLinkNoExtra model={model.mappedName} />
          {model.mappedName.correctedOriginalName !==
            model.mappedName.taxon.validName && (
            <>
              {" "}
              (= <ModelLinkNoExtra model={model.mappedName.taxon} />)
            </>
          )}
        </>
      )}
    </>
  );
}

function ModelExtra({ model, context }: { model: ModelLink_model; context?: Context }) {
  switch (model.__typename) {
    case "Name":
      return <NameExtra model={model} />;
    case "Location":
      return <LocationExtra model={model} />;
    case "Person":
      return <PersonExtra model={model} />;
    case "Collection":
      return model.city ? <>, {model.city}</> : null;
    case "NameComment":
      return <CommentExtra model={model} />;
    case "ArticleComment":
      return <CommentExtra model={model} />;
    case "Article":
      return <OpenButton articleId={model.oid} />;
    case "ClassificationEntry":
      return <ClassificationEntryExtra model={model} context={context} />;
    default:
      return null;
  }
}

export type Context =
  | "ClassificationEntry"
  | "Article"
  | "Name"
  | "CitationGroup"
  | "Taxon"
  | "Collection"
  | "Person"
  | "Region"
  | "Location"
  | "Period"
  | "NameComplex"
  | "SpeciesNameComplex"
  | "StratigraphicUnit"
  | undefined;

class ModelLink extends React.Component<{ model: ModelLink_model; context?: Context }> {
  render() {
    const { model, context } = this.props;
    return (
      <>
        {model.__typename === "NameComment" || model.__typename === "ArticleComment" ? (
          <ReactMarkdown children={model.text || ""} />
        ) : (
          <ModelLinkNoExtra model={model} />
        )}
        <small>
          <ModelExtra model={model} context={context} />
        </small>
      </>
    );
  }
}

export default createFragmentContainer(ModelLink, {
  model: graphql`
    fragment ModelLink_model on Model {
      oid
      __typename
      ...ModelLinkNoExtra_model
      ... on Location {
        locationRegion: region {
          regionName: name
        }
        minPeriod {
          periodName: name
        }
        maxPeriod {
          periodName: name
        }
        stratigraphicUnit {
          periodName: name
        }
      }
      ... on Collection {
        city
      }
      ... on Name {
        status
        correctedOriginalName
        taxon {
          validName
          ...Title_model
        }
      }
      ... on Person {
        birth
        death
        bio
        personType: type
      }
      ... on NameComment {
        source {
          ...ModelLinkNoExtra_model
        }
        date
        page
        text
      }
      ... on ArticleComment {
        date
        text
      }
      ... on ClassificationEntry {
        article {
          ...ModelLinkNoExtra_model
        }
        page
        mappedName {
          ...ModelLinkNoExtra_model
          correctedOriginalName
          taxon {
            validName
            ...ModelLinkNoExtra_model
          }
        }
      }
    }
  `,
});
