import { ModelListEntry_model } from "./__generated__/ModelListEntry_model.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";
import ModelChildList, { supportsChildren } from "./ModelChildList";
import Reference from "../reference/Reference";

class ModelListEntry extends React.Component<
  { model: ModelListEntry_model; showChildren?: boolean },
  { showChildren: boolean | null }
> {
  constructor(props: { model: ModelListEntry_model; showChildren?: boolean }) {
    super(props);
    this.state = { showChildren: null };
  }
  render() {
    const { model } = this.props;
    const showChildren =
      this.state.showChildren === null
        ? this.props.showChildren
        : this.state.showChildren;
    return (
      <li>
        {model.__typename === "Article" ? (
          <Reference article={model} />
        ) : (
          <ModelLink model={model} />
        )}{" "}
        {supportsChildren(model) && (
          <>
            <small
              onClick={() =>
                this.setState((state) => {
                  return { showChildren: !showChildren };
                })
              }
            >
              {showChildren ? "hide" : "show"}
            </small>
            {showChildren && <ModelChildList model={model} />}
          </>
        )}
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
