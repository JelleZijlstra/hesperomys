import { TaxonTitle_taxon } from "./__generated__/TaxonTitle_taxon.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics, { RANK_TO_GROUP } from "../components/MaybeItalics";
import TaxonomicAuthority from "../reference/TaxonomicAuthority";

const STATUS_TO_TEXT = new Map([
  ["valid", "valid"],
  ["synonym", "synonym"],
  ["dubious", "dubious"],
  ["nomen_dubium", "nomen dubium"],
  ["species_inquirenda", "dubious"],
  ["spurious", "spurious"],
  ["removed", "removed"],
  ["composite", "composite"],
  ["hybrid", "hybrid"],
]);

const AGE_TO_SYMBOL = new Map([
  ["extant", ""],
  ["holocene", "🦴"],
  ["recently_extinct", "☠"],
  ["fossil", "†"],
  ["ichno", "👻"],
  ["removed", "!"],
  ["track", "👣"],
  ["egg", "🥚"],
  ["coprolite", "💩"],
  ["burrow", "🕳️"],
  ["bite_trace", "😋"],
  ["redirect", "→"],
]);

class TaxonTitle extends React.Component<{ taxon: TaxonTitle_taxon }> {
  render() {
    const { taxonRank, validName, baseName, age } = this.props.taxon;

    const shouldParenthesize =
      baseName.group === "species" &&
      baseName.correctedOriginalName !== null &&
      validName.split(" ")[0] !== baseName.correctedOriginalName.split(" ")[0];

    return (
      <>
        {AGE_TO_SYMBOL.get(age) || ""}
        <MaybeItalics group={RANK_TO_GROUP.get(taxonRank) || "high"} name={validName} />
        {baseName.authorTags && (
          <>
            {" "}
            {shouldParenthesize && "("}
            <TaxonomicAuthority authorTags={baseName.authorTags} />
            {baseName.numericYear && `, ${baseName.numericYear}`}
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
      age
      validName
      taxonRank: rank
      baseName {
        group
        correctedOriginalName
        authorTags {
          ...TaxonomicAuthority_authorTags
        }
        numericYear
        status
      }
    }
  `,
});
