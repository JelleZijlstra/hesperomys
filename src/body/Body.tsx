import { Body_model } from "./__generated__/Body_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameBody from "./NameBody";

class Body extends React.Component<{ model: Body_model }> {
  render() {
    const { model } = this.props;
    switch (model.__typename) {
      case "Name":
        return <NameBody name={model} />;
      default:
        return <>(unimplemented for {model.__typename})</>;
    }
  }
}

export default createFragmentContainer(Body, {
  model: graphql`
    fragment Body_model on Model {
      __typename
      ...NameBody_name
    }
  `,
});
