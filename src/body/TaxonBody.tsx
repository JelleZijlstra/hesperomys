import { TaxonBody_taxon } from "./__generated__/TaxonBody_taxon.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import TaxonContext from "../components/TaxonContext";

import TaxonChildren from "../lists/TaxonChildren";
import TaxonNames from "../lists/TaxonNames";

const RANK_TO_STRING = new Map([
  ["class_", "class"],
  ["species_group", "species group"],
]);
const AGE_CLASS_TO_STRING = new Map([
  ["bite_trace", "bite trace"],
  ["ichno", "other trace fossil"],
]);

class TaxonBody extends React.Component<{
  taxon: TaxonBody_taxon;
}> {
  render() {
    const { taxon } = this.props;
    const { taxonRank, validName, age, parent, baseName } = this.props.taxon;
    return (
      <>
        <Table
          data={[
            ["Name", validName],
            ["Rank", RANK_TO_STRING.get(taxonRank) || taxonRank],
            ["Age class", AGE_CLASS_TO_STRING.get(age) || age],
            ["Base name", <ModelLink model={baseName} />],
            ["Parent", parent ? <ModelLink model={parent} /> : null],
          ]}
        />
        <TaxonContext taxon={taxon} />
        <TaxonNames taxon={taxon} hideClassification showNameDetail />
        <TaxonChildren taxon={taxon} />
      </>
    );
  }
}

export default createFragmentContainer(TaxonBody, {
  taxon: graphql`
    fragment TaxonBody_taxon on Taxon {
      taxonRank: rank
      validName
      age
      parent {
        ...ModelLink_model
      }
      baseName {
        ...ModelLink_model
      }
      ...TaxonContext_taxon
      ...TaxonChildren_taxon
      ...TaxonNames_taxon @arguments(showNameDetail: true)
    }
  `,
});
