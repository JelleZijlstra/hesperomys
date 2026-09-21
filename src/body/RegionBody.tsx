import { RegionBody_region } from "./__generated__/RegionBody_region.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import RegionChildren from "../lists/RegionChildren";
import RegionCitationGroups from "../lists/RegionCitationGroups";
import RegionCollections from "../lists/RegionCollections";
import RegionPeriods from "../lists/RegionPeriods";
import RegionLocations from "../lists/RegionLocations";
import InlineMarkdown from "../components/InlineMarkdown";
import Table from "../components/Table";

class RegionBody extends React.Component<{
  region: RegionBody_region;
}> {
  render() {
    const { region } = this.props;
    const data: [string, JSX.Element | string | null][] = [
      ["Comment", region.comment ? <InlineMarkdown source={region.comment} /> : null],
    ];
    region.regionTags.forEach((tag) => {
      switch (tag.__typename) {
        case "IncompletelyDividedR":
          data.push(["Subdivision coverage", "incomplete"]);
          break;
        case "MustHavePreciseTypeLocalityR":
          data.push(["Type-locality policy", "precise locality required"]);
          break;
        case "OpenStreetMapR":
          data.push([
            "OpenStreetMap",
            <a href={`https://www.openstreetmap.org/${tag.osmType}/${tag.osmId}`}>
              {tag.osmType} {tag.osmId} ({tag.category})
            </a>,
          ]);
          break;
      }
    });
    return (
      <>
        <Table data={data} />
        <RegionChildren region={region} title="Child regions" />
        <RegionLocations region={region} />
        <RegionPeriods region={region} title="Stratigraphic units" />
        <RegionCollections region={region} />
        <RegionCitationGroups region={region} />
      </>
    );
  }
}

export default createFragmentContainer(RegionBody, {
  region: graphql`
    fragment RegionBody_region on Region {
      comment
      regionTags: tags {
        __typename
        ... on IncompletelyDividedR {
          _Ignored
        }
        ... on MustHavePreciseTypeLocalityR {
          _Ignored
        }
        ... on OpenStreetMapR {
          osmType
          osmId
          category
        }
      }
      ...RegionChildren_region
      ...RegionCitationGroups_region
      ...RegionCollections_region
      ...RegionPeriods_region
      ...RegionLocations_region
      ...RegionTypeLocalities_region
    }
  `,
});
