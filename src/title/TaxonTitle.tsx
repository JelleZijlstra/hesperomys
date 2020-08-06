import { TaxonTitle_taxon } from "./__generated__/TaxonTitle_taxon.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics from "../components/MaybeItalics";

class TaxonTitle extends React.Component<{ taxon: TaxonTitle_taxon }> {
  render() {
    const { baseName, validName } = this.props.taxon;

    return <MaybeItalics group={baseName.group} name={validName} />;
  }
}

export default createFragmentContainer(TaxonTitle, {
  taxon: graphql`
    fragment TaxonTitle_taxon on Taxon {
      validName
      baseName {
        group
      }
    }
  `,
});
