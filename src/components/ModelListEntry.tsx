import { ModelListEntry_model } from "./__generated__/ModelListEntry_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink, { Context } from "./ModelLink";
import ModelChildList, { supportsChildren } from "./ModelChildList";
import Reference from "../reference/Reference";

class ModelListEntry extends React.Component<
  { model: ModelListEntry_model; showChildren?: boolean; context?: Context },
  { showChildren: boolean | null }
> {
  constructor(props: {
    model: ModelListEntry_model;
    showChildren?: boolean;
    context?: Context;
  }) {
    super(props);
    this.state = { showChildren: null };
  }
  render() {
    const { model, context } = this.props;
    const showChildren =
      this.state.showChildren === null
        ? this.props.showChildren
        : this.state.showChildren;
    return (
      <li>
        {supportsChildren(model) && (
          <span
            style={{ cursor: "pointer" }}
            onClick={() =>
              this.setState((state) => {
                return { showChildren: !showChildren };
              })
            }
          >
            {showChildren ? "▼" : "▶"}
          </span>
        )}{" "}
        {model.__typename === "Article" ? (
          <Reference article={model} />
        ) : (
          <ModelLink model={model} context={context} />
        )}
        {showChildren && <ModelChildList model={model} context={context} />}
      </li>
    );
  }
}

export default createFragmentContainer(ModelListEntry, {
  model: graphql`
    fragment ModelListEntry_model on Model {
      __typename
      ...ModelChildList_model
      ...ModelChildList_model @relay(mask: false)
      ...ModelLink_model
      ...Reference_article
    }
  `,
});
