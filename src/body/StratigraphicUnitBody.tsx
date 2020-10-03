import { StratigraphicUnitBody_stratigraphicUnit } from "./__generated__/StratigraphicUnitBody_stratigraphicUnit.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import StratigraphicUnitChildren from "../lists/StratigraphicUnitChildren";
import StratigraphicUnitLocations from "../lists/StratigraphicUnitLocations";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

class StratigraphicUnitBody extends React.Component<{
  stratigraphicUnit: StratigraphicUnitBody_stratigraphicUnit;
}> {
  render() {
    const { stratigraphicUnit } = this.props;
    const { parent, prev, region } = stratigraphicUnit;
    const data: [string, JSX.Element][] = [];
    if (parent) {
      data.push(["Parent", <ModelLink model={parent} />]);
    }
    if (prev) {
      data.push(["Underlying unit", <ModelLink model={prev} />]);
    }
    if (region) {
      data.push(["Located in", <ModelLink model={region} />]);
    }
    return (
      <>
        <Table data={data} />
        <StratigraphicUnitChildren stratigraphicUnit={stratigraphicUnit} />
        <StratigraphicUnitLocations
          stratigraphicUnit={stratigraphicUnit}
          title="Locations"
        />
      </>
    );
  }
}

export default createFragmentContainer(StratigraphicUnitBody, {
  stratigraphicUnit: graphql`
    fragment StratigraphicUnitBody_stratigraphicUnit on StratigraphicUnit {
      oid
      parent {
        ...ModelLink_model
      }
      prev {
        ...ModelLink_model
      }
      region {
        ...ModelLink_model
      }
      ...StratigraphicUnitChildren_stratigraphicUnit
      ...StratigraphicUnitLocations_stratigraphicUnit
    }
  `,
});
