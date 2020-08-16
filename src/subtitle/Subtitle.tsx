import { Subtitle_model } from "./__generated__/Subtitle_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameSubtitle from "./NameSubtitle";

class Subtitle extends React.Component<{ model: Subtitle_model }> {
  render() {
    const { model } = this.props;
    switch (model.__typename) {
      case "Name":
        return <NameSubtitle name={model} />;
      default:
        return null;
    }
  }
}

export default createFragmentContainer(Subtitle, {
  model: graphql`
    fragment Subtitle_model on Model {
      __typename
      ...NameSubtitle_name
    }
  `,
});
