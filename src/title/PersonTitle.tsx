import { PersonTitle_person } from "./__generated__/PersonTitle_person.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class PersonTitle extends React.Component<{
  person: PersonTitle_person;
}> {
  render() {
    const {
      familyName,
      givenNames,
      initials,
      tussenvoegsel,
      suffix,
      namingConvention,
    } = this.props.person;
    return (
      <>
        {givenNames || initials}
        {(givenNames || initials) && " "}
        {tussenvoegsel && tussenvoegsel + " "}
        {familyName}
        {suffix &&
          (namingConvention === "ancient" ? " " + suffix : ", " + suffix)}
      </>
    );
  }
}

export default createFragmentContainer(PersonTitle, {
  person: graphql`
    fragment PersonTitle_person on Person {
      familyName
      givenNames
      initials
      tussenvoegsel
      suffix
      namingConvention
    }
  `,
});
