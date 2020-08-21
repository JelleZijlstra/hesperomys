import { PeriodBody_period } from "./__generated__/PeriodBody_period.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class PeriodBody extends React.Component<{
  period: PeriodBody_period;
}> {
  render() {
    const { oid } = this.props.period;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(PeriodBody, {
  period: graphql`
    fragment PeriodBody_period on Period {
      oid
    }
  `,
});
