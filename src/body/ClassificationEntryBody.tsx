import { ClassificationEntryBody_classificationEntry } from "./__generated__/ClassificationEntryBody_classificationEntry.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import MaybeItalics, { RANK_TO_GROUP } from "../components/MaybeItalics";
import Table from "../components/Table";
import ModelLink from "../components/ModelLink";
import ClassificationEntryChildren from "../lists/ClassificationEntryChildren";
import { Rank } from "./Rank";

function InfoSection({ ce }: { ce: ClassificationEntryBody_classificationEntry }) {
  const rank = ce.ceRank === "synonym" ? ce.parent?.ceRank || "other" : ce.ceRank;
  const group = RANK_TO_GROUP.get(rank) || "high";
  const data: [string | JSX.Element, string | JSX.Element | null][] = [
    ["Name", <MaybeItalics group={group} name={ce.ceName} />],
    ["Rank", <Rank rank={ce.ceRank} />],
    ["Source", <ModelLink model={ce.article} />],
    ["Appears on page", ce.page],
    ["Authority as given", ce.authority],
    ["Year as given", ce.year],
    ["Citation as given", ce.citation],
    ["Type locality as given", ce.ceTL],
    ["Parent", ce.parent ? <ModelLink model={ce.parent} /> : null],
    ["Identified with", ce.mappedName ? <ModelLink model={ce.mappedName} /> : null],
  ];
  ce.tags.forEach((tag) => {
    switch (tag.__typename) {
      case "CorrectedName":
        data.push(["Normalized name", tag.text]);
        break;
      case "TextualRank":
        data.push(["Rank as given", tag.text]);
        break;
      case "PageLink":
        data.push([`Link to page ${tag.page}`, <a href={tag.url}>{tag.url}</a>]);
        break;
    }
  });
  return (
    <>
      <h3>Information</h3>
      <Table data={data} />
    </>
  );
}

function ContextSectionNoParent({
  ce,
}: {
  ce: ClassificationEntryBody_classificationEntry;
}) {
  return (
    <ul>
      <li>
        <b>
          <ModelLink model={ce} />
        </b>
        <ClassificationEntryChildren classificationEntry={ce} hideTitle />
      </li>
    </ul>
  );
}

function ContextSection({ ce }: { ce: ClassificationEntryBody_classificationEntry }) {
  if (ce.parent) {
    return (
      <ul>
        <li key="parent">
          <ModelLink model={ce.parent} />
          <ContextSectionNoParent ce={ce} />
        </li>
      </ul>
    );
  }
  return <ContextSectionNoParent ce={ce} />;
}

class ClassificationEntryBody extends React.Component<{
  classificationEntry: ClassificationEntryBody_classificationEntry;
}> {
  render() {
    const { ceName } = this.props.classificationEntry;
    return (
      <>
        <InfoSection ce={this.props.classificationEntry} />
        <h3>Classification context</h3>
        <ContextSection ce={this.props.classificationEntry} />
      </>
    );
  }
}

export default createFragmentContainer(ClassificationEntryBody, {
  classificationEntry: graphql`
    fragment ClassificationEntryBody_classificationEntry on ClassificationEntry {
      ceName: name
      ceRank: rank
      page
      article {
        ...ModelLink_model
      }
      mappedName {
        ...ModelLink_model
      }
      authority
      year
      citation
      ceTL: typeLocality
      parent {
        ceRank: rank
        ...ModelLink_model
      }
      ...ModelLink_model
      ...ClassificationEntryChildren_classificationEntry
      tags {
        __typename
        ... on CorrectedName {
          text
        }
        ... on TextualRank {
          text
        }
        ... on PageLink {
          url
          page
        }
      }
    }
  `,
});
