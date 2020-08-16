import { ModelLink_model } from "./__generated__/ModelLink_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import Title from "../title/Title";

class ModelLink extends React.Component<{ model: ModelLink_model }> {
  render() {
    const { model } = this.props;
    const { callSign, oid } = model;
    const url = `/${callSign}/${oid}`;
    return (
      <Link to={url}>
        <Title model={model} />
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
    }
  `,
});
