import { PersonBody_person } from "./__generated__/PersonBody_person.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import PersonCollected from "../lists/PersonCollected";
import PersonPatronyms from "../lists/PersonPatronyms";
import PersonNames from "../lists/PersonNames";
import PersonArticles from "../lists/PersonArticles";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";

class PersonBody extends React.Component<{
  person: PersonBody_person;
}> {
  render() {
    const { person } = this.props;
    const data: [string, JSX.Element | string][] = [];
    data.push([
      "Family name",
      <Link to={"/h/" + person.familyName}>{person.familyName}</Link>,
    ]);
    if (person.givenNames) {
      data.push(["Given names", person.givenNames]);
    }
    if (person.initials) {
      data.push(["Initials", person.initials]);
    }
    if (person.suffix) {
      data.push(["Suffix", person.suffix]);
    }
    if (person.tussenvoegsel) {
      data.push(["Particle", person.tussenvoegsel]);
    }
    if (person.birth) {
      data.push(["Year of birth", person.birth]);
    }
    if (person.death) {
      data.push(["Year of death", person.death]);
    }
    if (person.bio) {
      data.push(["Short description", person.bio]);
    }
    data.push(["Naming convention", person.namingConvention]);
    return (
      <>
        <Table data={data} />
        {person.tags && (
          <ul>
            {person.tags.map((tag) => {
              if (!tag) {
                return null;
              }
              switch (tag.__typename) {
                case "Wiki":
                  return tag.text ? (
                    <li key={tag.text}>
                      <a href={tag.text}>{tag.text}</a>
                    </li>
                  ) : null;
                case "ActiveRegion":
                  return (
                    <li key={tag.region.id}>
                      Region of activity: <ModelLink model={tag.region} />
                    </li>
                  );
                case "Institution":
                  return (
                    <li key={tag.institution.id}>
                      Institution: <ModelLink model={tag.institution} />
                    </li>
                  );
                case "Biography":
                  return (
                    <li key={tag.article.id}>
                      Biography: <ModelLink model={tag.article} />
                    </li>
                  );
                default:
                  return null;
              }
            })}
          </ul>
        )}
        <PersonPatronyms person={person} />
        <PersonCollected person={person} />
        <PersonNames person={person} />
        <PersonArticles person={person} />
      </>
    );
  }
}

export default createFragmentContainer(PersonBody, {
  person: graphql`
    fragment PersonBody_person on Person {
      familyName
      givenNames
      initials
      suffix
      tussenvoegsel
      birth
      death
      namingConvention
      bio
      tags {
        __typename
        ... on Wiki {
          text
        }
        ... on Biography {
          article {
            id
            ...ModelLink_model
          }
        }
        ... on Institution {
          institution {
            id
            ...ModelLink_model
          }
        }
        ... on ActiveRegion {
          region {
            id
            ...ModelLink_model
          }
        }
      }
      ...PersonPatronyms_person
      ...PersonCollected_person
      ...PersonNames_person
      ...PersonArticles_person
    }
  `,
});
