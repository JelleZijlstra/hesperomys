import { ClassificationEntryBody_classificationEntry } from "./__generated__/ClassificationEntryBody_classificationEntry.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import MaybeItalics, { RANK_TO_GROUP } from "../components/MaybeItalics";
import Table from "../components/Table";
import ModelLink from "../components/ModelLink";
import Reference from "../reference/Reference";
import ClassificationEntryChildren from "../lists/ClassificationEntryChildren";
import { Rank } from "./Rank";

function InfoSection({ ce }: { ce: ClassificationEntryBody_classificationEntry }) {
  const rank = ce.ceRank === "synonym" ? ce.parent?.ceRank || "other" : ce.ceRank;
  const group = RANK_TO_GROUP.get(rank) || "high";
  const sourceData: [string | JSX.Element, string | JSX.Element | null][] = [
    ["Name", <MaybeItalics group={group} name={ce.ceName} />],
    ["Source", <Reference article={ce.article} />],
    ["Authority as given", ce.authority],
    ["Year as given", ce.year],
    ["Citation as given", ce.citation],
    ["Type locality as given", ce.ceTL],
    ["Parent", ce.parent ? <ModelLink model={ce.parent} /> : null],
  ];
  const interpData: [string | JSX.Element, string | JSX.Element | null][] = [];
  if (ce.mappedName) {
    interpData.push(["Identified with", <ModelLink model={ce.mappedName} />]);
  }
  let textualRank: string | null = null;
  let pageLinkUrl: string | null = null;
  ce.tags.forEach((tag) => {
    switch (tag.__typename) {
      case "AgeClassCE":
        sourceData.push(["Age class", tag.age.replace(/_/g, " ")]);
        break;
      case "CECondition":
        sourceData.push([
          "Condition",
          tag.comment
            ? `${tag.status.replace(/_/g, " ")} (comment: ${tag.comment})`
            : tag.status.replace(/_/g, " "),
        ]);
        break;
      case "CommentFromDatabase":
        interpData.push(["Comment (database)", tag.text]);
        break;
      case "CommentFromSource":
        sourceData.push(["Comment (source)", tag.text]);
        break;
      case "CommonName":
        sourceData.push([
          "Common name",
          `${tag.commonName} (${tag.language.replace(/_/g, " ")})`,
        ]);
        break;
      case "CorrectedName":
        interpData.push(["Normalized name", tag.text]);
        break;
      case "LSIDCE":
        sourceData.push(["LSID", tag.text]);
        break;
      case "OriginalCombination":
        sourceData.push(["Original combination", tag.text]);
        break;
      case "OriginalPageDescribed":
        sourceData.push(["Original page described", tag.text]);
        break;
      case "TextualRank":
        textualRank = tag.text;
        break;
      case "PageLink":
        pageLinkUrl = tag.url;
        break;
      case "ReferencedUsage":
        interpData.push([
          "Refers to previous usage:",
          <>
            <ModelLink model={tag.ce} />
            {tag.comment ? ` (comment: ${tag.comment})` : ""}
          </>,
        ]);
        break;
      case "TypeSpecimenData":
        sourceData.push(["Type specimen data", tag.text]);
        break;
      case "TreatedAsDubious":
        sourceData.push(["Treated as dubious", "yes"]);
        break;
    }
  });
  // Add grouped rows where related fields should appear together.
  // Rank + Textual rank (as given)
  sourceData.splice(1, 0, [
    "Rank",
    <>
      <Rank rank={ce.ceRank} />
      {textualRank && <> (as given: {textualRank})</>}
    </>,
  ]);
  // Appears on page + Page link
  sourceData.splice(2, 0, [
    "Appears on page",
    <>
      {ce.page}
      {pageLinkUrl && (
        <>
          {" "}
          (<a href={pageLinkUrl}>view page</a>)
        </>
      )}
    </>,
  ]);
  return (
    <>
      <h3>Original data</h3>
      <Table data={sourceData} />
      {interpData.length > 0 && (
        <>
          <h3>Interpretation</h3>
          <Table data={interpData} />
        </>
      )}
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
    return (
      <>
        <InfoSection ce={this.props.classificationEntry} />
        <h3>Classification in context</h3>
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
        ...Reference_article
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
        ... on AgeClassCE {
          age
        }
        ... on CECondition {
          status
          comment
        }
        ... on CommentFromDatabase {
          text
        }
        ... on CommentFromSource {
          text
        }
        ... on CommonName {
          commonName: name
          language
        }
        ... on CorrectedName {
          text
        }
        ... on LSIDCE {
          text
        }
        ... on TextualRank {
          text
        }
        ... on PageLink {
          url
          page
        }
        ... on OriginalCombination {
          text
        }
        ... on OriginalPageDescribed {
          text
        }
        ... on ReferencedUsage {
          ce {
            ...ModelLink_model
          }
          comment
        }
        ... on TypeSpecimenData {
          text
        }
        ... on TreatedAsDubious {
          _Ignored
        }
      }
    }
  `,
});
