import { PeriodBody_period } from "./__generated__/PeriodBody_period.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import PeriodChildren from "../lists/PeriodChildren";
import PeriodLocations from "../lists/PeriodLocations";
import PeriodStratigraphicUnitsMin from "../lists/PeriodStratigraphicUnitsMin";
import PeriodStratigraphicUnitsMax from "../lists/PeriodStratigraphicUnitsMax";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

class PeriodBody extends React.Component<{
  period: PeriodBody_period;
}> {
  render() {
    const { period } = this.props;
    const {
      parent,
      prev,
      next,
      region,
      minAge,
      maxAge,
      minPeriod,
      maxPeriod,
      periodComment,
    } = period as any;
    const data: [string, JSX.Element | string | null][] = [];
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
    if (minAge || maxAge) {
      const ageText =
        minAge && maxAge && minAge !== maxAge
          ? `${minAge}–${maxAge} Ma`
          : `${minAge || maxAge} Ma`;
      data.push(["Age (approx.)", ageText]);
    }
    if (minPeriod || maxPeriod) {
      data.push([
        "Correlates",
        <>
          {minPeriod && <ModelLink model={minPeriod} />}
          {minPeriod && maxPeriod && " – "}
          {maxPeriod && <ModelLink model={maxPeriod} />}
        </>,
      ]);
    }
    if (periodComment) {
      data.push(["Comment", periodComment]);
    }
    return (
      <>
        <Table data={data} />
        <PeriodChildren period={period} />
        <PeriodLocations period={period} title="Locations" />
        <PeriodStratigraphicUnitsMin
          period={period}
          title="Stratigraphic units (min)"
        />
        <PeriodStratigraphicUnitsMax
          period={period}
          title="Stratigraphic units (max)"
        />
      </>
    );
  }
}

export default createFragmentContainer(PeriodBody, {
  period: graphql`
    fragment PeriodBody_period on Period {
      oid
      minAge
      maxAge
      minPeriod {
        ...ModelLink_model
      }
      maxPeriod {
        ...ModelLink_model
      }
      periodComment: comment
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
      ...PeriodLocations_period
      ...PeriodStratigraphicUnitsMin_period
      ...PeriodStratigraphicUnitsMax_period
    }
  `,
});
