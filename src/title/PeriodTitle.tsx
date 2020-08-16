import { PeriodTitle_period } from "./__generated__/PeriodTitle_period.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class PeriodTitle extends React.Component<{ period: PeriodTitle_period }> {
  render() {
    const { periodName } = this.props.period;

    return <>{periodName}</>;
  }
}

export default createFragmentContainer(PeriodTitle, {
  period: graphql`
    fragment PeriodTitle_period on Period {
      periodName: name
    }
  `,
});
