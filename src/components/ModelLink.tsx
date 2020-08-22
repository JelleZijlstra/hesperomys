import { ModelLink_model } from "./__generated__/ModelLink_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import Title from "../title/Title";

function NameExtra({ model } : {model: ModelLink_model}) {
  if (!model.taxon || !model.status) {
    return null;
  }
  const parts: [string, JSX.Element][] = [];
  if (model.status !== "valid") {
    parts.push(["status", <>{model.status.replace("_", " ")}</>]);
  }
  if (model.correctedOriginalName !== model.taxon.validName) {
    parts.push(["validName", <>= <Title model={model.taxon} /></>]);
  }
  if (parts.length === 0) {
    return null;
  }
  return <> ({parts.map((part, i) => <React.Fragment key={part[0]}>{i > 0 && ", "}{part[1]}</React.Fragment>)})</>;
}

class ModelLink extends React.Component<{ model: ModelLink_model }> {
  render() {
    const { model } = this.props;
    const { callSign, oid } = model;
    const url = `/${callSign}/${oid}`;
    return (
      <Link to={url}>
        <Title model={model} /><NameExtra model={model} />
      </Link>
    );
  }
}

export default createFragmentContainer(ModelLink, {
  model: graphql`
    fragment ModelLink_model on Model {
      oid
      callSign
      ...Title_model
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
