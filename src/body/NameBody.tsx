import { NameBody_name } from "./__generated__/NameBody_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics from "../components/MaybeItalics";
import Table from "../components/Table";

function NameSection({ name }: { name: NameBody_name }) {
  const { group } = name;
  return (
    <>
      <h2>Name</h2>
      <Table
        data={[
          ["Root name", <MaybeItalics name={name.rootName} group={group} />],
          ["Original name", name.originalName],
          ["Corrected original name", name.correctedOriginalName],
          ["Author", name.authority],
        ]}
      />
    </>
  );
}

class NameBody extends React.Component<{ name: NameBody_name }> {
  render() {
    const { name } = this.props;

    return (
      <>
        <NameSection name={name} />
      </>
    );
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
