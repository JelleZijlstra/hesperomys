import { TaxonBody_taxon } from "./__generated__/TaxonBody_taxon.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import TaxonContext from "../components/TaxonContext";
import NamesMissingField from "../components/NamesMissingField";

import TaxonChildList from "../components/TaxonChildList";
import TaxonNames from "../lists/TaxonNames";
import { Rank } from "./Rank";
import MaybeItalicize, { RANK_TO_GROUP } from "../components/MaybeItalics";

const AGE_CLASS_TO_STRING = new Map([
  ["bite_trace", "bite trace"],
  ["ichno", "other trace fossil"],
]);

class TaxonBody extends React.Component<{
  taxon: TaxonBody_taxon;
}> {
  render() {
    const { taxon } = this.props;
    const { taxonRank, validName, age, parent, baseName, tags } = this.props.taxon;
    const group = RANK_TO_GROUP.get(taxonRank) || "high";
    const data: [string, string | React.ReactElement | null][] = [
      ["Name", <MaybeItalicize group={group} name={validName} />],
      ["Rank", <Rank rank={taxonRank} />],
      ["Age class", AGE_CLASS_TO_STRING.get(age) || age],
      ["Base name", <ModelLink model={baseName} />],
      ["Parent", parent ? <ModelLink model={parent} /> : null],
    ];
    tags.forEach((tag) => {
      switch (tag.__typename) {
        case "NominalGenus":
          data.push(["Nominal genus", <ModelLink model={tag.genus} />]);
          break;
      }
    });
    return (
      <>
        <Table data={data} />
        <TaxonContext taxon={taxon} />
        <TaxonNames
          taxon={taxon}
          hideClassification
          showNameDetail
          groupVariants
          context="Taxon"
        />
        <TaxonChildList taxon={taxon} />
        <NamesMissingField taxon={taxon} />
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
      ...TaxonChildList_taxon
      ...TaxonNames_taxon @arguments(showNameDetail: true)
      ...NamesMissingField_taxon

      tags {
        __typename
        ... on NominalGenus {
          genus {
            ...ModelLink_model
          }
        }
      }
    }
  `,
});
