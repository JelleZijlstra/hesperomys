import { PersonTitle_person } from "./__generated__/PersonTitle_person.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import Romanized from "../components/Romanized";

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
    const pieces = [];
    if (givenNames) {
      pieces.push(givenNames);
      pieces.push(" ");
    } else if (initials) {
      pieces.push(initials);
      pieces.push(" ");
    }
    if (tussenvoegsel) {
      pieces.push(tussenvoegsel);
      pieces.push(" ");
    }
    pieces.push(familyName);
    if (suffix) {
      pieces.push(namingConvention === "ancient" ? " " : ", ");
      pieces.push(suffix);
    }
    return <Romanized text={pieces.join("")} />;
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
