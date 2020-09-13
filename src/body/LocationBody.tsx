import { LocationBody_location } from "./__generated__/LocationBody_location.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import { Link } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import LocationTypeLocalities from "../lists/LocationTypeLocalities";

class LocationBody extends React.Component<{
  location: LocationBody_location;
}> {
  render() {
    const { location } = this.props;
    const data: [string | JSX.Element, JSX.Element][] = [];
    const isGeneral = location.tags.some(
      (tag) => tag && tag.__typename === "General"
    );
    data.push(["Region", <ModelLink model={location.locationRegion} />]);
    if (location.minPeriod) {
      data.push(["Minimum age", <ModelLink model={location.minPeriod} />]);
    }
    if (location.maxPeriod) {
      data.push(["Maximum age", <ModelLink model={location.maxPeriod} />]);
    }
    if (location.stratigraphicUnit) {
      data.push([
        "Stratigraphic unit",
        <ModelLink model={location.stratigraphicUnit} />,
      ]);
    }
    location.tags.forEach((tag) => {
      if (!tag) {
        return;
      }
      switch (tag.__typename) {
        case "ETMNA":
          data.push([
            <>
              <Link to="/a/44170">Janis et al. (2008)</Link> identifier
            </>,
            <>{tag.id}</>,
          ]);
          break;
        case "PBDB":
          data.push([
            "PBDB identifier",
            <a
              href={`https://paleobiodb.org/classic/displayCollResults?collection_no=${tag.id}`}
            >
              {tag.id}
            </a>,
          ]);
          break;
        case "NOW":
          data.push([
            "NOW identifier",
            <a href="http://pantodon.science.helsinki.fi/now/locality_list.php">
              {tag.id}
            </a>,
          ]);
          break;
      }
    });
    return (
      <>
        {isGeneral &&
          "This is a general location. Type localities are listed here until they are moved to a more precise location."}
        <Table data={data} />
        <LocationTypeLocalities location={location} title="Type localities" />
      </>
    );
  }
}

export default createFragmentContainer(LocationBody, {
  location: graphql`
    fragment LocationBody_location on Location {
      minPeriod {
        ...ModelLink_model
      }
      maxPeriod {
        ...ModelLink_model
      }
      stratigraphicUnit {
        ...ModelLink_model
      }
      locationRegion: region {
        ...ModelLink_model
      }
      tags {
        __typename
        ... on PBDB {
          id
        }
        ... on NOW {
          id
        }
        ... on ETMNA {
          id
        }
        ... on General {
          _Ignored
        }
      }
      ...LocationTypeLocalities_location
    }
  `,
});
