import { PeriodBody_period } from "./__generated__/PeriodBody_period.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import PeriodChildren from "../lists/PeriodChildren";
import PeriodLocationsChronology from "../lists/PeriodLocationsChronology";
import PeriodLocationsStratigraphy from "../lists/PeriodLocationsStratigraphy";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

class PeriodBody extends React.Component<{
  period: PeriodBody_period;
}> {
  render() {
    const { period } = this.props;
    const { parent, prev, next, region, system } = period;
    const data: [string, JSX.Element][] = [];
    if (parent) {
      data.push(["Parent", <ModelLink model={parent} />]);
    }
    if (prev) {
      data.push(["Preceding period", <ModelLink model={prev} />]);
    }
    if (next) {
      data.push(["Succeeding period", <ModelLink model={next} />]);
    }
    if (region) {
      data.push(["Located in", <ModelLink model={region} />]);
    }
    return (
      <>
        <Table data={data} />
        <PeriodChildren period={period} />
        {system === "lithostratigraphy" ? (
          <PeriodLocationsStratigraphy period={period} title="Locations" />
        ) : (
          <PeriodLocationsChronology period={period} title="Locations" />
        )}
      </>
    );
  }
}

export default createFragmentContainer(PeriodBody, {
  period: graphql`
    fragment PeriodBody_period on Period {
      oid
      system
      parent {
        ...ModelLink_model
      }
      prev {
        ...ModelLink_model
      }
      next {
        ...ModelLink_model
      }
      region {
        ...ModelLink_model
      }
      ...PeriodChildren_period
      ...PeriodLocationsChronology_period
      ...PeriodLocationsStratigraphy_period
    }
  `,
});
