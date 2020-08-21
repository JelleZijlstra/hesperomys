
import { TaxonBody_taxon } from "./__generated__/TaxonBody_taxon.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class TaxonBody extends React.Component<{
  taxon: TaxonBody_taxon;
}> {
  render() {
    const { oid } = this.props.taxon;
    return (
      <>
        {oid}
      </>
    );
  }
}

export default createFragmentContainer(TaxonBody, {
  taxon: graphql`
    fragment TaxonBody_taxon on Taxon {
      oid
    }
  `,
});
