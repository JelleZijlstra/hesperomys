import { NameBody_name } from "./__generated__/NameBody_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class NameBody extends React.Component<{ name: NameBody_name }> {
  render() {
    const { name } = this.props;

    return <>{JSON.stringify(name)}</>;
  }
}

export default createFragmentContainer(NameBody, {
  name: graphql`
    fragment NameBody_name on Name {
      id
      originalName
      correctedOriginalName
      group
      rootName
      authority
      year
      pageDescribed
      typeSpecimen
      ...NameTitle_name
    }
  `,
});
