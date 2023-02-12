import { TaxonomicAuthority_authorTags } from "./__generated__/TaxonomicAuthority_authorTags.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import Romanized from "../components/Romanized";

const SingleTaxonomicAuthority = ({
  person,
}: {
  person: TaxonomicAuthority_authorTags[0]["person"];
}) => {
  if (!person || !person.familyName) {
    return <></>;
  }
  const pieces = [];
  if (person.tussenvoegsel && person.namingConvention === "dutch") {
    pieces.push(
      person.tussenvoegsel[0].toUpperCase() + person.tussenvoegsel.slice(1) + " ",
    );
  }
  pieces.push(person.familyName);
  return <Romanized text={pieces.join("")} />;
};

class TaxonomicAuthority extends React.Component<{
  authorTags: TaxonomicAuthority_authorTags;
}> {
  render() {
    const { authorTags } = this.props;
    const numAuthors = authorTags.length;

    return (
      <>
        {authorTags.map((author, i) => (
          <React.Fragment key={author.person && author.person.id}>
            <SingleTaxonomicAuthority person={author.person} />
            {i < numAuthors - 2 && ", "}
            {i === numAuthors - 2 && " & "}
          </React.Fragment>
        ))}
      </>
    );
  }
}

export default createFragmentContainer(TaxonomicAuthority, {
  authorTags: graphql`
    fragment TaxonomicAuthority_authorTags on AuthorTag @relay(plural: true) {
      ... on Author {
        person {
          id
          familyName
          namingConvention
          tussenvoegsel
        }
      }
    }
  `,
});
