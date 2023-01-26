import { ModelLink_model } from "./__generated__/ModelLink_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import Title from "../title/Title";
import ModelLinkNoExtra from "./ModelLinkNoExtra";
import ReactMarkdown from "react-markdown";

function PersonExtra({ model }: { model: ModelLink_model }) {
  const parts = [];
  if (model.birth || model.death) {
    parts.push((model.birth ?? "") + "–" + (model.death ?? ""));
  }
  if (model.bio) {
    parts.push(model.bio);
  }
  if (model.personType) {
    parts.push(model.personType);
  }
  return <> ({parts.join("; ")})</>;
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

function ModelExtra({ model }: { model: ModelLink_model }) {
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
    default:
      return null;
  }
}

class ModelLink extends React.Component<{ model: ModelLink_model }> {
  render() {
    const { model } = this.props;
    return (
      <>
        {model.__typename === "NameComment" || model.__typename === "ArticleComment" ? (
          <ReactMarkdown children={model.text || ""} />
        ) : (
          <ModelLinkNoExtra model={model} />
        )}
        <small>
          <ModelExtra model={model} />
        </small>
      </>
    );
  }
}

export default createFragmentContainer(ModelLink, {
  model: graphql`
    fragment ModelLink_model on Model {
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
    }
  `,
});
