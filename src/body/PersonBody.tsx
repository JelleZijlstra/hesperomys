import { PersonBody_person } from "./__generated__/PersonBody_person.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { Link } from "react-router-dom";

import PersonCollectedAll from "../lists/PersonCollectedAll";
import PersonPatronymsAll from "../lists/PersonPatronymsAll";
import PersonOrderedNames from "../lists/PersonOrderedNames";
import PersonOrderedArticles from "../lists/PersonOrderedArticles";
import PersonInvolvedAll from "../lists/PersonInvolvedAll";
import PersonAliases from "../lists/PersonAliases";

import ModelLink from "../components/ModelLink";
import Table from "../components/Table";
import Romanized from "../components/Romanized";

class PersonBody extends React.Component<{
  person: PersonBody_person;
}> {
  render() {
    const { person } = this.props;
    const data: [string, JSX.Element | string][] = [];
    if (person.target) {
      data.push(["Canonical name", <ModelLink model={person.target} />]);
    }
    data.push([
      "Family name",
      <Link to={"/h/" + person.familyName}>
        <Romanized text={person.familyName} />
      </Link>,
    ]);
    if (person.givenNames) {
      data.push(["Given names", <Romanized text={person.givenNames} />]);
    }
    if (person.initials) {
      data.push(["Initials", <Romanized text={person.initials} />]);
    }
    if (person.suffix) {
      data.push(["Suffix", <Romanized text={person.suffix} />]);
    }
    if (person.tussenvoegsel) {
      data.push(["Particle", <Romanized text={person.tussenvoegsel} />]);
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
                case "ORCID":
                  return tag.text ? (
                    <li key={tag.text}>
                      ORCID: <a href={`https://orcid.org/${tag.text}`}>{tag.text}</a>
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
        <PersonAliases person={person} />
        <PersonPatronymsAll person={person} title="Patronyms" />
        <PersonOrderedNames person={person} title="New names" />
        <PersonOrderedArticles person={person} title="Bibliography" />
        <PersonCollectedAll person={person} title="Type specimens collected" />
        <PersonInvolvedAll person={person} title="Involvement with type specimens" />
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
      target {
        ...ModelLink_model
      }
      tags {
        __typename
        ... on Wiki {
          text
        }
        ... on ORCID {
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
      ...PersonAliases_person
      ...PersonPatronymsAll_person
      ...PersonCollectedAll_person
      ...PersonInvolvedAll_person
      ...PersonOrderedNames_person
      ...PersonOrderedArticles_person
    }
  `,
});
