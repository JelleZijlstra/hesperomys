import { ModelListEntry_model } from "./__generated__/ModelListEntry_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";

class ModelListEntry extends React.Component<
  { model: ModelListEntry_model },
  { showChildren: boolean }
> {
  constructor(props: { model: ModelListEntry_model }) {
    super(props);
    this.state = { showChildren: false };
  }
  render() {
    const { model } = this.props;
    return (
      <li>
        <ModelLink model={model} />{" "}
        <small
          onClick={() =>
            this.setState((state) => {
              return { showChildren: !state.showChildren };
            })
          }
        >
          {this.state.showChildren ? "hide" : "show"}
        </small>
      </li>
    );
  }
}

export default createFragmentContainer(ModelListEntry, {
  model: graphql`
    fragment ModelListEntry_model on Model {
      oid
      callSign
      ...ModelLink_model
    }
  `,
});
