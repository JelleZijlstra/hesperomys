import { ClassificationEntryBody_classificationEntry } from "./__generated__/ClassificationEntryBody_classificationEntry.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import MaybeItalics, { RANK_TO_GROUP } from "../components/MaybeItalics";
import Table from "../components/Table";
import InlineMarkdown from "../components/InlineMarkdown";
import ModelLink from "../components/ModelLink";
import Reference from "../reference/Reference";
import ClassificationEntryChildren from "../lists/ClassificationEntryChildren";
import { Rank } from "./Rank";
import ClassificationEntryOccurrenceRecords from "../lists/ClassificationEntryOccurrenceRecords";

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
  ce.classificationEntryTags.forEach((tag) => {
    switch (tag.__typename) {
      case "EtymologyDetailCE":
        sourceData.push(["Etymology as given", <InlineMarkdown source={tag.text} />]);
        break;
      case "VerbatimParentCE":
        sourceData.push(["Parent as given", <ModelLink model={tag.ce} />]);
        break;
      case "OriginalCitationCE":
        interpData.push(["Original description", "yes"]);
        break;
      case "AuxiliaryNameCE":
        interpData.push(["Auxiliary name", "yes"]);
        break;
      case "AgeClassCE":
        sourceData.push(["Age class", tag.age.replace(/_/g, " ")]);
        break;
      case "CEConditionCE":
        sourceData.push([
          "Condition",
          <>
            {tag.status.replace(/_/g, " ")}
            {tag.comment && (
              <>
                {" "}
                (comment: <InlineMarkdown source={tag.comment} />)
              </>
            )}
          </>,
        ]);
        break;
      case "CommentFromDatabaseCE":
        interpData.push(["Comment (database)", <InlineMarkdown source={tag.text} />]);
        break;
      case "CommentFromSourceCE":
        sourceData.push(["Comment (source)", <InlineMarkdown source={tag.text} />]);
        break;
      case "CommonNameCE":
        sourceData.push([
          "Common name",
          `${tag.commonName} (${tag.language.replace(/_/g, " ")})`,
        ]);
        break;
      case "CorrectedNameCE":
        interpData.push(["Normalized name", tag.text]);
        break;
      case "LSIDCE":
        sourceData.push(["LSID", tag.text]);
        break;
      case "OriginalCombinationCE":
        sourceData.push(["Original combination", tag.text]);
        break;
      case "OriginalPageDescribedCE":
        sourceData.push(["Original page described", tag.text]);
        break;
      case "TextualRankCE":
        textualRank = tag.text;
        break;
      case "PageLinkCE":
        pageLinkUrl = tag.url;
        break;
      case "ReferencedUsageCE":
        interpData.push([
          "Refers to previous usage:",
          <>
            <ModelLink model={tag.ce} />
            {tag.comment && (
              <>
                {" "}
                (comment: <InlineMarkdown source={tag.comment} />)
              </>
            )}
          </>,
        ]);
        break;
      case "TypeSpecimenDataCE":
        sourceData.push(["Type specimen data", <InlineMarkdown source={tag.text} />]);
        break;
      case "TreatedAsDubiousCE":
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
        <ClassificationEntryOccurrenceRecords
          classificationEntry={this.props.classificationEntry}
        />
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
      ...ClassificationEntryOccurrenceRecords_classificationEntry
      classificationEntryTags: tags {
        __typename
        ... on EtymologyDetailCE {
          text
        }
        ... on VerbatimParentCE {
          ce {
            ...ModelLink_model
          }
        }
        ... on OriginalCitationCE {
          _Ignored
        }
        ... on AuxiliaryNameCE {
          _Ignored
        }
        ... on AgeClassCE {
          age
        }
        ... on CEConditionCE {
          status
          comment
        }
        ... on CommentFromDatabaseCE {
          text
        }
        ... on CommentFromSourceCE {
          text
        }
        ... on CommonNameCE {
          commonName: name
          language
        }
        ... on CorrectedNameCE {
          text
        }
        ... on LSIDCE {
          text
        }
        ... on TextualRankCE {
          text
        }
        ... on PageLinkCE {
          url
          page
        }
        ... on OriginalCombinationCE {
          text
        }
        ... on OriginalPageDescribedCE {
          text
        }
        ... on ReferencedUsageCE {
          ce {
            ...ModelLink_model
          }
          comment
        }
        ... on TypeSpecimenDataCE {
          text
        }
        ... on TreatedAsDubiousCE {
          _Ignored
        }
      }
    }
  `,
});
