import { StratigraphicUnitTitle_stratigraphicUnit } from "./__generated__/StratigraphicUnitTitle_stratigraphicUnit.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class StratigraphicUnitTitle extends React.Component<{
  stratigraphicUnit: StratigraphicUnitTitle_stratigraphicUnit;
}> {
  render() {
    const { suName } = this.props.stratigraphicUnit;
    return <>{suName}</>;
  }
}

export default createFragmentContainer(StratigraphicUnitTitle, {
  stratigraphicUnit: graphql`
    fragment StratigraphicUnitTitle_stratigraphicUnit on StratigraphicUnit {
      suName: name
    }
  `,
});
