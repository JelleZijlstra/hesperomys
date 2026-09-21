import { OccurrenceRecordBody_occurrenceRecord } from "./__generated__/OccurrenceRecordBody_occurrenceRecord.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import InlineMarkdown from "../components/InlineMarkdown";
import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import CoordinatesLink from "../components/CoordinatesLink";

const words = (value: string) => value.replace(/_/g, " ");

class OccurrenceRecordBody extends React.Component<{
  occurrenceRecord: OccurrenceRecordBody_occurrenceRecord;
}> {
  render() {
    const record = this.props.occurrenceRecord;
    const data: [string, JSX.Element | string | null][] = [
      [
        "Classification entry",
        <>
          <ModelLink model={record.classificationEntry} /> (CE#
          {record.classificationEntry.oid})
        </>,
      ],
      [
        "Taxon",
        record.occurrenceRecordTaxon ? (
          <ModelLink model={record.occurrenceRecordTaxon} />
        ) : null,
      ],
      [
        "Location",
        record.occurrenceRecordLocation ? (
          <ModelLink model={record.occurrenceRecordLocation} />
        ) : null,
      ],
      ["Locality as given", record.localityText],
      ["Page", record.page],
      ["Basis", words(record.basis)],
      ["Status", words(record.occurrenceRecordStatus)],
      ["Raw source data", record.rawData],
    ];

    record.occurrenceRecordTags.forEach((tag) => {
      switch (tag.__typename) {
        case "CommentFromDatabaseOR":
          data.push(["Comment (database)", <InlineMarkdown source={tag.text} />]);
          break;
        case "CommentFromSourceOR":
          data.push(["Comment (source)", <InlineMarkdown source={tag.text} />]);
          break;
        case "CoordinateUncertaintyFromSourceOR":
          data.push(["Coordinate uncertainty", tag.text]);
          break;
        case "CoordinatesOR":
          data.push([
            "Coordinates",
            <CoordinatesLink
              latitude={tag.latitude}
              longitude={tag.longitude}
              openstreetmapUrl={tag.openstreetmapUrl}
            />,
          ]);
          break;
        case "DateOR":
          data.push(["Date", tag.date]);
          break;
        case "ElevationOR":
          data.push(["Elevation", `${tag.elevation} ${tag.unit}`]);
          break;
        case "LocationHintOR":
          data.push(["Location hint", tag.name]);
          break;
        case "MolecularDataOR":
          data.push(["Molecular data", "yes"]);
          break;
        case "ObservationKindOR":
          data.push(["Observation kind", words(tag.kind)]);
          break;
        case "OriginFromSourceOR":
          data.push([
            "Origin as given",
            tag.originComment
              ? `${words(tag.origin)} (${tag.originComment})`
              : words(tag.origin),
          ]);
          break;
        case "PresenceFromSourceOR":
          data.push([
            "Presence as given",
            tag.presenceComment
              ? `${words(tag.presence)} (${tag.presenceComment})`
              : words(tag.presence),
          ]);
          break;
        case "RedirectTargetOR":
          data.push(["Redirect target", <ModelLink model={tag.record} />]);
          break;
        case "ReviewedInLightOfOR":
          data.push([
            "Reviewed in light of",
            <>
              <ModelLink model={tag.article} /> for <ModelLink model={tag.taxon} /> (
              <InlineMarkdown source={tag.reviewedComment} />)
            </>,
          ]);
          break;
        case "SpecimenDetailOR":
          data.push(["Specimen detail", <InlineMarkdown source={tag.text} />]);
          break;
        case "TaxonomicSplitFromOR":
          data.push(["Taxonomic split from", <ModelLink model={tag.record} />]);
          break;
        case "ValidityAssessmentOR":
          data.push([
            "Validity assessment",
            tag.validityAssessmentComment
              ? `${words(tag.validity)} (${tag.validityAssessmentComment})`
              : words(tag.validity),
          ]);
          break;
        case "ValidityFromSourceOR":
          data.push([
            "Validity as given",
            tag.validityFromSourceComment
              ? `${words(tag.validity)} (${tag.validityFromSourceComment})`
              : words(tag.validity),
          ]);
          break;
        case "VerbatimCoordinatesOR":
          data.push(["Coordinates as given", tag.text]);
          break;
        case "VerbatimDateOR":
          data.push(["Date as given", tag.text]);
          break;
        case "VerbatimElevationOR":
          data.push(["Elevation as given", tag.text]);
          break;
        case "VoucherOR":
          data.push([
            "Voucher",
            <>
              {tag.text} (<ModelLink model={tag.collection} />)
            </>,
          ]);
          break;
      }
    });

    return <Table data={data} />;
  }
}

export default createFragmentContainer(OccurrenceRecordBody, {
  occurrenceRecord: graphql`
    fragment OccurrenceRecordBody_occurrenceRecord on OccurrenceRecord {
      classificationEntry {
        oid
        ...ModelLink_model
      }
      occurrenceRecordTaxon: taxon {
        ...ModelLink_model
      }
      occurrenceRecordLocation: location {
        ...ModelLink_model
      }
      localityText
      page
      basis
      occurrenceRecordStatus: status
      rawData
      occurrenceRecordTags: tags {
        __typename
        ... on CommentFromDatabaseOR {
          text
        }
        ... on CommentFromSourceOR {
          text
        }
        ... on CoordinateUncertaintyFromSourceOR {
          text
        }
        ... on CoordinatesOR {
          latitude
          longitude
          openstreetmapUrl
        }
        ... on DateOR {
          date
        }
        ... on ElevationOR {
          elevation
          unit
        }
        ... on LocationHintOR {
          name
        }
        ... on MolecularDataOR {
          _Ignored
        }
        ... on ObservationKindOR {
          kind
        }
        ... on OriginFromSourceOR {
          origin
          originComment: comment
        }
        ... on PresenceFromSourceOR {
          presence
          presenceComment: comment
        }
        ... on RedirectTargetOR {
          record {
            ...ModelLink_model
          }
        }
        ... on ReviewedInLightOfOR {
          article {
            ...ModelLink_model
          }
          taxon {
            ...ModelLink_model
          }
          reviewedComment: comment
        }
        ... on SpecimenDetailOR {
          text
        }
        ... on TaxonomicSplitFromOR {
          record {
            ...ModelLink_model
          }
        }
        ... on ValidityAssessmentOR {
          validity
          validityAssessmentComment: comment
        }
        ... on ValidityFromSourceOR {
          validity
          validityFromSourceComment: comment
        }
        ... on VerbatimCoordinatesOR {
          text
        }
        ... on VerbatimDateOR {
          text
        }
        ... on VerbatimElevationOR {
          text
        }
        ... on VoucherOR {
          text
          collection {
            ...ModelLink_model
          }
        }
      }
    }
  `,
});
