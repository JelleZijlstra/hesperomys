import { TypeLocalityLink_location } from "./__generated__/TypeLocalityLink_location.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import { Link } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";

import CoordinatesLink from "./CoordinatesLink";
import ModelLinkNoExtra from "./ModelLinkNoExtra";

type Region = TypeLocalityLink_location["regionPath"][0];

function normalizeRegionName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function includesRegionName(childName: string, parentName: string) {
  const child = normalizeRegionName(childName);
  const parent = normalizeRegionName(parentName);
  return child === parent || ` ${child} `.includes(` ${parent} `);
}

export function regionsForDisplay(regions: readonly Region[]) {
  return regions.filter(
    (region, index) =>
      !regions
        .slice(0, index)
        .some((child) => includesRegionName(child.name, region.name)),
  );
}

function TypeLocalityLink({ location }: { location: TypeLocalityLink_location }) {
  const regions = regionsForDisplay(location.regionPath);
  const minPeriod = location.minPeriod && location.minPeriod.name;
  const maxPeriod = location.maxPeriod && location.maxPeriod.name;
  const age =
    minPeriod && maxPeriod
      ? minPeriod === maxPeriod
        ? minPeriod
        : `${maxPeriod}–${minPeriod}`
      : minPeriod || maxPeriod;
  const stratigraphicUnit =
    location.stratigraphicUnit && location.stratigraphicUnit.name !== "Recent"
      ? location.stratigraphicUnit.name
      : null;
  const hasCoordinates = location.latitude && location.longitude;
  const hasContext = age || regions.length > 0 || stratigraphicUnit || hasCoordinates;

  return (
    <>
      <ModelLinkNoExtra model={location} />
      {hasContext && (
        <small>
          {" ("}
          {age}
          {age && regions.length > 0 && " of "}
          {regions.map((region, index) => (
            <React.Fragment key={region.oid}>
              {index > 0 && ", "}
              <Link to={`/r/${region.oid}`}>{region.name}</Link>
            </React.Fragment>
          ))}
          {stratigraphicUnit && (
            <>
              {age || regions.length > 0 ? "; " : null}
              {stratigraphicUnit}
            </>
          )}
          {hasCoordinates && (
            <>
              {age || regions.length > 0 || stratigraphicUnit ? "; " : null}
              <CoordinatesLink
                latitude={location.latitude!}
                longitude={location.longitude!}
                openstreetmapUrl={location.openstreetmapUrl}
              />
            </>
          )}
          {`)`}
        </small>
      )}
    </>
  );
}

export default createFragmentContainer(TypeLocalityLink, {
  location: graphql`
    fragment TypeLocalityLink_location on Location {
      ...ModelLinkNoExtra_model
      minPeriod {
        name
      }
      maxPeriod {
        name
      }
      stratigraphicUnit {
        name
      }
      regionPath {
        oid
        name
      }
      latitude
      longitude
      openstreetmapUrl
    }
  `,
});
