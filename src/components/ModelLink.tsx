import { ModelLink_model } from "./__generated__/ModelLink_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import Title from "../title/Title";

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

function ModelExtra({ model }: { model: ModelLink_model }) {
  switch (model.__typename) {
    case "Name":
      return <NameExtra model={model} />;
    case "Location":
      return <LocationExtra model={model} />;
    case "Collection":
      return model.city ? <>, {model.city}</> : null;
    default:
      return null;
  }
}

class ModelLink extends React.Component<{ model: ModelLink_model }> {
  render() {
    const { model } = this.props;
    const { callSign, oid } = model;
    const url = `/${callSign}/${oid}`;
    return (
      <>
        <Link to={url}>
          <Title model={model} />
        </Link>
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
      oid
      callSign
      __typename
      ...Title_model
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
    }
  `,
});
