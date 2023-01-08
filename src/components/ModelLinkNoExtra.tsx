import { ModelLinkNoExtra_model } from "./__generated__/ModelLinkNoExtra_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import Title from "../title/Title";

class ModelLinkNoExtra extends React.Component<{
  model: ModelLinkNoExtra_model;
}> {
  render() {
    const { model } = this.props;
    const { callSign, oid } = model;
    const url = `/${callSign.toLowerCase()}/${oid}`;
    return (
      <Link to={url}>
        <Title model={model} />
      </Link>
    );
  }
}

export default createFragmentContainer(ModelLinkNoExtra, {
  model: graphql`
    fragment ModelLinkNoExtra_model on Model {
      oid
      callSign
      ...Title_model
    }
  `,
});
