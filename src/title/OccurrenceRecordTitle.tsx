import { OccurrenceRecordTitle_occurrenceRecord } from "./__generated__/OccurrenceRecordTitle_occurrenceRecord.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics, { RANK_TO_GROUP } from "../components/MaybeItalics";
import TaxonomicAuthority from "../reference/TaxonomicAuthority";
import ClassificationEntryTitle from "./ClassificationEntryTitle";
import LocationTitle from "./LocationTitle";

class OccurrenceRecordTitle extends React.Component<{
  occurrenceRecord: OccurrenceRecordTitle_occurrenceRecord;
}> {
  render() {
    const record = this.props.occurrenceRecord;
    const entry = record.occurrenceRecordTitleClassificationEntry;
    const article = entry.article;

    return (
      <>
        {record.occurrenceRecordTitleTaxon ? (
          <MaybeItalics
            group={
              RANK_TO_GROUP.get(record.occurrenceRecordTitleTaxon.taxonRank) || "high"
            }
            name={record.occurrenceRecordTitleTaxon.validName}
          />
        ) : (
          <ClassificationEntryTitle classificationEntry={entry} />
        )}{" "}
        at{" "}
        {record.occurrenceRecordTitleLocation ? (
          <LocationTitle location={record.occurrenceRecordTitleLocation} />
        ) : (
          record.occurrenceRecordTitleLocalityText
        )}{" "}
        (
        <TaxonomicAuthority authorTags={article.authorTags} short />
        {article.authorTags.length > 0 && article.numericYear && ", "}
        {article.numericYear})
      </>
    );
  }
}

export default createFragmentContainer(OccurrenceRecordTitle, {
  occurrenceRecord: graphql`
    fragment OccurrenceRecordTitle_occurrenceRecord on OccurrenceRecord {
      occurrenceRecordTitleTaxon: taxon {
        validName
        taxonRank: rank
      }
      occurrenceRecordTitleLocation: location {
        ...LocationTitle_location
      }
      occurrenceRecordTitleLocalityText: localityText
      occurrenceRecordTitleClassificationEntry: classificationEntry {
        article {
          authorTags {
            ...TaxonomicAuthority_authorTags
          }
          numericYear
        }
        ...ClassificationEntryTitle_classificationEntry
      }
    }
  `,
});
