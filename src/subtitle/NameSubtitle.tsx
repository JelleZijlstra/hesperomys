import { NameSubtitle_name } from "./__generated__/NameSubtitle_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

const STATUS_TO_TEXT = new Map([
  ["valid", "Valid name for"],
  ["synonym", "Synonym of"],
  ["dubious", "Dubious name allocated to"],
  ["nomen_dubium", "Nomen dubium allocated to"],
  ["species_inquirenda", "Name requiring further investigation in"],
  ["spurious", "Spurious name in"],
  ["removed", "Removed name in"],
]);

class NameSubtitle extends React.Component<{ name: NameSubtitle_name }> {
  render() {
    const { status, taxon } = this.props.name;
    return (
      <>
        {STATUS_TO_TEXT.get(status)} <ModelLink model={taxon} />
      </>
    );
  }
}

export default createFragmentContainer(NameSubtitle, {
  name: graphql`
    fragment NameSubtitle_name on Name {
      status
      taxon {
        ...ModelLink_model
      }
    }
  `,
});
