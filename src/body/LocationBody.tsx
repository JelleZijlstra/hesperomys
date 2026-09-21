import { LocationBody_location } from "./__generated__/LocationBody_location.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import { Link } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";
import InlineMarkdown from "../components/InlineMarkdown";
import Table from "../components/Table";
import LocationPartialTypeLocalities from "../lists/LocationPartialTypeLocalities";
import LocationTypeLocalities from "../lists/LocationTypeLocalities";
import LocationOccurrenceRecords from "../lists/LocationOccurrenceRecords";
import CoordinatesLink from "../components/CoordinatesLink";

function optionalDetail(value: string | null) {
  if (!value || value.trim().toLowerCase() === "none") {
    return null;
  }
  return value;
}

class LocationBody extends React.Component<{
  location: LocationBody_location;
}> {
  render() {
    const { location } = this.props;
    const data: [string | JSX.Element, string | JSX.Element | null][] = [];
    const isGeneral = location.locationTags.some(
      (tag) => tag && tag.__typename === "GeneralL",
    );
    let unplacedComment: string | null | undefined;
    data.push(["Region", <ModelLink model={location.locationRegion} />]);
    data.push([
      "Parent location",
      location.parent ? <ModelLink model={location.parent} /> : null,
    ]);
    data.push([
      "Coordinates",
      location.latitude && location.longitude ? (
        <CoordinatesLink
          latitude={location.latitude}
          longitude={location.longitude}
          openstreetmapUrl={location.openstreetmapUrl}
        />
      ) : null,
    ]);
    data.push(["Location detail", optionalDetail(location.locationDetail)]);
    data.push(["Age detail", optionalDetail(location.ageDetail)]);
    data.push([
      "Source",
      location.source ? <ModelLink model={location.source} /> : null,
    ]);
    data.push([
      "Comment",
      location.comment ? <InlineMarkdown source={location.comment} /> : null,
    ]);
    if (
      location.minPeriod &&
      location.maxPeriod &&
      location.minPeriod.oid === location.maxPeriod.oid
    ) {
      data.push(["Period", <ModelLink model={location.minPeriod} />]);
    } else {
      if (location.minPeriod) {
        data.push(["Minimum age", <ModelLink model={location.minPeriod} />]);
      }
      if (location.maxPeriod) {
        data.push(["Maximum age", <ModelLink model={location.maxPeriod} />]);
      }
    }
    if (location.stratigraphicUnit) {
      data.push([
        "Stratigraphic unit",
        <ModelLink model={location.stratigraphicUnit} />,
      ]);
    }
    location.locationTags.forEach((tag) => {
      if (!tag) {
        return;
      }
      switch (tag.__typename) {
        case "UnplacedL":
          unplacedComment = tag.unplacedComment;
          break;
        case "ETMNAL":
          data.push([
            <>
              <Link to="/a/44170">Janis et al. (2008)</Link> identifier
            </>,
            <>{tag.id}</>,
          ]);
          break;
        case "PBDBL":
          data.push([
            "PBDB identifier",
            <a
              href={`https://paleobiodb.org/classic/displayCollResults?collection_no=${tag.id}`}
            >
              {tag.id}
            </a>,
          ]);
          break;
        case "NOWL":
          data.push([
            "NOW identifier",
            <a href="http://pantodon.science.helsinki.fi/now/locality_list.php">
              {tag.id}
            </a>,
          ]);
          break;
        case "CoordinatesFromGeoNamesL":
          data.push([
            "Coordinate source",
            <a href={`https://www.geonames.org/${tag.geonameId}/`}>
              GeoNames {tag.geonameId}
            </a>,
          ]);
          break;
        case "CoordinatesFromNominatimL":
          data.push([
            "Coordinate source",
            <a href={`https://www.openstreetmap.org/${tag.osmType}/${tag.osmId}`}>
              OpenStreetMap {tag.osmType} {tag.osmId} ({tag.category})
            </a>,
          ]);
          break;
        case "CoordinatesFromNameL":
          data.push([
            "Coordinate source",
            <>
              Name <ModelLink model={tag.name} />
              {tag.coordinatesFromNameText && <> ({tag.coordinatesFromNameText})</>}
            </>,
          ]);
          break;
        case "CoordinatesFromOccurrenceRecordL":
          data.push(["Coordinate source", <ModelLink model={tag.occurrenceRecord} />]);
          break;
        case "CoordinatesFromLocationNameL":
          data.push(["Coordinate source", "parsed from the location name"]);
          break;
        case "CoordinatesManualL":
          data.push(["Coordinate source", tag.coordinatesManualComment]);
          break;
        case "NearbyRegionL":
          data.push(["Nearby region", <ModelLink model={tag.region} />]);
          break;
        case "PLSSL":
          data.push([
            "PLSS description",
            <>
              {location.plssMapUrl ? (
                <a href={location.plssMapUrl}>{tag.plssText}</a>
              ) : (
                tag.plssText
              )}
              {tag.plssComment && <> ({tag.plssComment})</>}
            </>,
          ]);
          break;
      }
    });
    return (
      <>
        {isGeneral &&
          "This is a general location. Type localities are listed here until they are moved to a more precise location."}
        {unplacedComment !== undefined && (
          <p>
            This locality is unplaced.
            {unplacedComment && <> {unplacedComment}</>}
          </p>
        )}
        <Table data={data} />
        <LocationTypeLocalities location={location} title="Type localities" />
        <LocationPartialTypeLocalities
          location={location}
          title="Partial type localities"
        />
        <LocationOccurrenceRecords location={location} />
      </>
    );
  }
}

export default createFragmentContainer(LocationBody, {
  location: graphql`
    fragment LocationBody_location on Location {
      minPeriod {
        oid
        ...ModelLink_model
      }
      maxPeriod {
        oid
        ...ModelLink_model
      }
      stratigraphicUnit {
        ...ModelLink_model
      }
      locationRegion: region {
        ...ModelLink_model
      }
      parent {
        ...ModelLink_model
      }
      latitude
      longitude
      openstreetmapUrl
      plssMapUrl
      locationDetail
      ageDetail
      comment
      source {
        ...ModelLink_model
      }
      locationTags: tags {
        __typename
        ... on PBDBL {
          id
        }
        ... on NOWL {
          id
        }
        ... on ETMNAL {
          id
        }
        ... on GeneralL {
          _Ignored
        }
        ... on UnplacedL {
          unplacedComment: comment
        }
        ... on CoordinatesFromGeoNamesL {
          geonameId
        }
        ... on CoordinatesFromNominatimL {
          osmType
          osmId
          category
        }
        ... on CoordinatesFromNameL {
          name {
            ...ModelLink_model
          }
          coordinatesFromNameText: text
        }
        ... on CoordinatesFromOccurrenceRecordL {
          occurrenceRecord {
            ...ModelLink_model
          }
        }
        ... on CoordinatesFromLocationNameL {
          _Ignored
        }
        ... on CoordinatesManualL {
          coordinatesManualComment: comment
        }
        ... on NearbyRegionL {
          region {
            ...ModelLink_model
          }
        }
        ... on PLSSL {
          plssText: text
          plssComment: comment
        }
      }
      ...LocationPartialTypeLocalities_location
      ...LocationTypeLocalities_location
      ...LocationOccurrenceRecords_location
    }
  `,
});
