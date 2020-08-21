import { OccurrenceBody_occurrence } from "./__generated__/OccurrenceBody_occurrence.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class OccurrenceBody extends React.Component<{
  occurrence: OccurrenceBody_occurrence;
}> {
  render() {
    const { oid } = this.props.occurrence;
    return <>{oid}</>;
  }
}

export default createFragmentContainer(OccurrenceBody, {
  occurrence: graphql`
    fragment OccurrenceBody_occurrence on Occurrence {
      oid
    }
  `,
});
