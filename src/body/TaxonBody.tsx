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
import InlineMarkdown from "../components/InlineMarkdown";
import TaxonOccurrenceRecords from "../lists/TaxonOccurrenceRecords";

const AGE_CLASS_TO_STRING = new Map([
  ["bite_trace", "bite trace"],
  ["ichno", "other trace fossil"],
]);

class TaxonBody extends React.Component<{
  taxon: TaxonBody_taxon;
}> {
  render() {
    const { taxon } = this.props;
    const { taxonRank, validName, age, parent, baseName, taxonTags } = this.props.taxon;
    const group = RANK_TO_GROUP.get(taxonRank) || "high";
    const data: [string, string | React.ReactElement | null][] = [
      ["Name", <MaybeItalicize group={group} name={validName} />],
      ["Rank", <Rank rank={taxonRank} />],
      ["Age class", AGE_CLASS_TO_STRING.get(age) || age],
      ["Base name", <ModelLink model={baseName} />],
      ["Parent", parent ? <ModelLink model={parent} /> : null],
    ];
    const distributionData: [string, string | React.ReactElement | null][] = [];
    taxonTags.forEach((tag) => {
      switch (tag.__typename) {
        case "NominalGenusT":
          data.push(["Nominal genus", <ModelLink model={tag.genus} />]);
          break;
        case "MDDT":
          if (taxonRank === "species") {
            data.push([
              "Links",
              <a href={`https://www.mammaldiversity.org/taxon/${tag.id}/`}>
                Mammal Diversity Database (#{tag.id})
              </a>,
            ]);
          }
          break;
        case "RegionalOriginT":
          distributionData.push([
            "Regional origin",
            <>
              <ModelLink model={tag.region} />: {tag.origin.replace(/_/g, " ")} (
              <ModelLink model={tag.source} />
              {tag.comment && (
                <>
                  {"; "}
                  <InlineMarkdown source={tag.comment} />
                </>
              )}
              )
            </>,
          ]);
          break;
        case "RegionalPresenceT":
          distributionData.push([
            "Regional presence",
            <>
              <ModelLink model={tag.region} />: {tag.presence.replace(/_/g, " ")} (
              <ModelLink model={tag.source} />
              {tag.comment && (
                <>
                  {"; "}
                  <InlineMarkdown source={tag.comment} />
                </>
              )}
              )
            </>,
          ]);
          break;
        case "RedirectOccurrencesT":
          data.push([
            "Occurrence redirection",
            <>
              Records from <ModelLink model={tag.region} />
              {tag.cutoffYear && ` through ${tag.cutoffYear}`} redirect to{" "}
              <ModelLink model={tag.target} /> (source: <ModelLink model={tag.source} />
              )
              {tag.comment && (
                <>
                  {"; "}
                  <InlineMarkdown source={tag.comment} />
                </>
              )}
            </>,
          ]);
          break;
        case "ReassessOccurrencesT":
          data.push([
            "Occurrence review",
            <>
              Reassess records from <ModelLink model={tag.region} />
              {tag.cutoffYear && ` through ${tag.cutoffYear}`} (source:{" "}
              <ModelLink model={tag.source} />)
              {tag.comment && (
                <>
                  {"; "}
                  <InlineMarkdown source={tag.comment} />
                </>
              )}
            </>,
          ]);
          break;
      }
    });
    return (
      <>
        <Table data={data} />
        {distributionData.length > 0 && (
          <section>
            <h3>Distribution data</h3>
            <Table data={distributionData} />
          </section>
        )}
        <TaxonContext taxon={taxon} />
        <TaxonNames taxon={taxon} showNameDetail groupVariants context="Taxon" />
        <TaxonChildList taxon={taxon} />
        <TaxonOccurrenceRecords taxon={taxon} />
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
      ...TaxonOccurrenceRecords_taxon

      taxonTags: tags {
        __typename
        ... on NominalGenusT {
          genus {
            ...ModelLink_model
          }
        }
        ... on MDDT {
          id
        }
        ... on RegionalOriginT {
          region {
            ...ModelLink_model
          }
          origin
          source {
            ...ModelLink_model
          }
          comment
        }
        ... on RegionalPresenceT {
          region {
            ...ModelLink_model
          }
          presence
          source {
            ...ModelLink_model
          }
          comment
        }
        ... on RedirectOccurrencesT {
          region {
            ...ModelLink_model
          }
          target {
            ...ModelLink_model
          }
          source {
            ...ModelLink_model
          }
          cutoffYear
          comment
        }
        ... on ReassessOccurrencesT {
          region {
            ...ModelLink_model
          }
          source {
            ...ModelLink_model
          }
          cutoffYear
          comment
        }
      }
    }
  `,
});
