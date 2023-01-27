import { ReferencePrefix_article } from "./__generated__/ReferencePrefix_article.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import InlineMarkdown from "../components/InlineMarkdown";

interface ReferencePrefixProps {
  article: ReferencePrefix_article;
  skipLinks?: boolean;
}

const initializeGiven = (givenNames: string) => {
  const names = givenNames.split(" ");
  return names
    .map((name) => {
      if (name[0].toUpperCase() === name[0]) {
        return name[0] + ".";
      } else {
        return " " + name;
      }
    })
    .join("");
};

const SingleAuthor = ({
  person,
}: {
  person: ReferencePrefix_article["authorTags"][0]["person"];
}) => {
  if (!person || !person.familyName) {
    return <></>;
  }
  const addComma =
    person.initials ||
    person.givenNames ||
    (person.tussenvoegsel && person.namingConvention === "dutch");
  return (
    <>
      {person.tussenvoegsel &&
        person.namingConvention !== "dutch" &&
        person.tussenvoegsel + " "}
      {person.familyName}
      {addComma && ", "}
      {person.givenNames ? initializeGiven(person.givenNames) : person.initials}
      {person.tussenvoegsel &&
        person.namingConvention === "dutch" &&
        " " + person.tussenvoegsel}
      {person.suffix &&
        (person.namingConvention === "ancient"
          ? " " + person.suffix
          : ", " + person.suffix)}
    </>
  );
};

const Authors = ({ article }: ReferencePrefixProps) => {
  const { authorTags } = article;
  const numAuthors = authorTags.length;

  return (
    <>
      {authorTags.map((author, i) => (
        <React.Fragment key={author.person && author.person.id}>
          <SingleAuthor person={author.person} />
          {i < numAuthors - 2 && ", "}
          {i === numAuthors - 2 && " & "}
        </React.Fragment>
      ))}
      {numAuthors > 0 && " "}
    </>
  );
};

const ReferencePrefix = ({ article, skipLinks }: ReferencePrefixProps) => (
  <>
    <Authors article={article} />
    {!skipLinks && article.numericYear && `${article.numericYear}. `}
    {skipLinks ? (
      article.title ? (
        <InlineMarkdown source={article.title} />
      ) : (
        "[No title]"
      )
    ) : (
      <Link to={`/a/${article.oid}`}>
        {article.title ? <InlineMarkdown source={article.title} /> : "[No title]"}
      </Link>
    )}
    {". "}
  </>
);

export default createFragmentContainer(ReferencePrefix, {
  article: graphql`
    fragment ReferencePrefix_article on Article {
      type
      authorTags {
        ... on Author {
          person {
            id
            familyName
            givenNames
            initials
            tussenvoegsel
            suffix
            namingConvention
          }
        }
      }
      numericYear
      oid
      title
    }
  `,
});
