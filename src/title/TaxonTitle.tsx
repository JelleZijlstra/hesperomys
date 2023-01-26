import { TaxonTitle_taxon } from "./__generated__/TaxonTitle_taxon.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics from "../components/MaybeItalics";
import TaxonomicAuthority from "../reference/TaxonomicAuthority";

const STATUS_TO_TEXT = new Map([
  ["valid", "valid"],
  ["synonym", "synonym"],
  ["dubious", "dubious"],
  ["nomen_dubium", "nomen dubium"],
  ["species_inquirenda", "dubious"],
  ["spurious", "spurious"],
  ["removed", "removed"],
]);

const RANK_TO_GROUP = new Map([
  ["subspecies", "species"],
  ["species", "species"],
  ["species_group", "species"],
  ["subgenus", "genus"],
  ["genus", "genus"],
  ["division", "high"],
  ["infratribe", "family"],
  ["subtribe", "family"],
  ["tribe", "family"],
  ["subfamily", "family"],
  ["family", "family"],
  ["superfamily", "family"],
  ["hyperfamily", "family"],
  ["parvorder", "high"],
  ["infraorder", "high"],
  ["suborder", "high"],
  ["order", "high"],
  ["superorder", "high"],
  ["subcohort", "high"],
  ["cohort", "high"],
  ["supercohort", "high"],
  ["infraclass", "high"],
  ["subclass", "high"],
  ["class_", "high"],
  ["superclass", "high"],
  ["infraphylum", "high"],
  ["subphylum", "high"],
  ["phylum", "high"],
  ["superphylum", "high"],
  ["infrakingdom", "high"],
  ["subkingdom", "high"],
  ["kingdom", "high"],
  ["superkingdom", "high"],
  ["domain", "high"],
  ["root", "high"],
  ["unranked", "high"],
  ["informal", "high"],
]);

class TaxonTitle extends React.Component<{ taxon: TaxonTitle_taxon }> {
  render() {
    const { taxonRank, validName, baseName } = this.props.taxon;

    const shouldParenthesize =
      baseName.group === "species" &&
      baseName.correctedOriginalName !== null &&
      validName.split(" ")[0] !== baseName.correctedOriginalName.split(" ")[0];

    return (
      <>
        <MaybeItalics group={RANK_TO_GROUP.get(taxonRank) || "high"} name={validName} />
        {baseName.authorTags && (
          <>
            {" "}
            {shouldParenthesize && "("}
            <TaxonomicAuthority authorTags={baseName.authorTags} />
            {baseName.year && ", " + baseName.year}
            {shouldParenthesize && ")"}
          </>
        )}
        {baseName.status !== "valid" && ` (${STATUS_TO_TEXT.get(baseName.status)})`}
      </>
    );
  }
}

export default createFragmentContainer(TaxonTitle, {
  taxon: graphql`
    fragment TaxonTitle_taxon on Taxon {
      validName
      taxonRank: rank
      baseName {
        group
        correctedOriginalName
        authorTags {
          ...TaxonomicAuthority_authorTags
        }
        year
        status
      }
    }
  `,
});
