import { TaxonContext_taxon } from "./__generated__/TaxonContext_taxon.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

function TaxonContext({ taxon }: { taxon: TaxonContext_taxon }) {
  const { class_, order, family } = taxon;
  const data: [string, JSX.Element][] = [];
  if (class_) {
    data.push([
      class_.rank === "class_" ? "Class" : "Class equivalent",
      <ModelLink model={class_} />,
    ]);
  }
  if (order) {
    data.push([
      order.rank === "order" ? "Order" : "Order equivalent",
      <ModelLink model={order} />,
    ]);
  }
  if (family) {
    data.push([
      family.rank === "family" ? "Family" : "Family equivalent",
      <ModelLink model={family} />,
    ]);
  }
  if (data.length === 0) {
    return null;
  }
  return (
    <>
      <h3>Context</h3>
      <Table data={data} />
    </>
  );
}

export default createFragmentContainer(TaxonContext, {
  taxon: graphql`
    fragment TaxonContext_taxon on Taxon {
      class_ {
        rank
        ...ModelLink_model
      }
      order {
        rank
        ...ModelLink_model
      }
      family {
        rank
        ...ModelLink_model
      }
    }
  `,
});
