import { NameTags_name } from "./__generated__/NameTags_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";
import InlineMarkdown from "./InlineMarkdown";

function Tag({ tag }: { tag: NameTags_name["tags"][0] }) {
  if (!tag) {
    return null;
  }
  switch (tag.__typename) {
    case "Conserved":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Placed on the Official List by <ModelLink model={tag.opinion} />
        </>
      );
    case "FullySuppressedBy":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Fully suppressed by <ModelLink model={tag.opinion} />
        </>
      );
    case "IncorrectOriginalSpellingOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Incorrect original spelling of <ModelLink model={tag.name} />
        </>
      );
    case "IncorrectSubsequentSpellingOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Incorrect subsequent spelling of <ModelLink model={tag.name} />
        </>
      );
    case "JustifiedEmendationOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Justified emendation (reason: {tag.justification}) of{" "}
          <ModelLink model={tag.name} />
        </>
      );
    case "MandatoryChangeOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Mandatory change of <ModelLink model={tag.name} />
        </>
      );
    case "NomenNovumFor":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Nomen novum for <ModelLink model={tag.name} />
        </>
      );
    case "NomenOblitum":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Nomen oblitum relative to <ModelLink model={tag.name} />
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
        </>
      );
    case "PreoccupiedBy":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Preoccupied by <ModelLink model={tag.name} />
        </>
      );
    case "PrimaryHomonymOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Primary homonym of <ModelLink model={tag.name} />
        </>
      );
    case "SecondaryHomonymOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Secondary homonym of <ModelLink model={tag.name} />
        </>
      );
    case "PartiallySuppressedBy":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Partially suppressed by <ModelLink model={tag.opinion} />
        </>
      );
    case "Rejected":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Rejected by <ModelLink model={tag.opinion} />
        </>
      );
    case "ReversalOfPriority":
      if (!tag.opinion || !tag.over) {
        return null;
      }
      return (
        <>
          Given priority over <ModelLink model={tag.over} /> by{" "}
          <ModelLink model={tag.opinion} />
        </>
      );
    case "SelectionOfPriority":
      if (!tag.optionalSource) {
        return null;
      }
      if (tag.overName) {
        return (
          <>
            Selected to have priority over <ModelLink model={tag.overName} /> by{" "}
            <ModelLink model={tag.optionalSource} />
            {tag.pageLink && (
              <>
                {" "}
                (<a href={tag.pageLink}>view page</a>)
              </>
            )}
          </>
        );
      } else if (tag.overCe) {
        return (
          <>
            Selected to have priority over <ModelLink model={tag.overCe} /> by{" "}
            <ModelLink model={tag.optionalSource} />
            {tag.pageLink && (
              <>
                {" "}
                (<a href={tag.pageLink}>view page</a>)
              </>
            )}
          </>
        );
      } else {
        return null;
      }
    case "SelectionOfSpelling":
      if (!tag.optionalSource) {
        return null;
      }
      return (
        <>
          Selected as the correct original spelling by{" "}
          <ModelLink model={tag.optionalSource} />
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
        </>
      );
    case "SubsequentUsageOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Subsequent usage of <ModelLink model={tag.name} />
        </>
      );
    case "MisidentificationOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Misidentification of <ModelLink model={tag.name} />
        </>
      );
    case "NameCombinationOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Name combination of <ModelLink model={tag.name} />
        </>
      );
    case "TakesPriorityOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Takes the priority of <ModelLink model={tag.name} />
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
        </>
      );
    case "UnjustifiedEmendationOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Unjustified emendation of <ModelLink model={tag.name} />
        </>
      );
    case "VariantOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Spelling variant of <ModelLink model={tag.name} />
        </>
      );
    case "NotPreoccupiedBy":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Not preoccupied by (but similar to) <ModelLink model={tag.name} />
        </>
      );
    case "Condition":
      return <>{tag.status.replace(/_/g, " ")}</>;
    case "ValidUse":
      if (!tag.source) {
        return null;
      }
      return (
        <>
          Used as a valid taxon by <ModelLink model={tag.source} />
        </>
      );
    case "VarietyOrForm":
      return <>Originally described as a "variety" or "form"</>;
    case "NotUsedAsValid":
      return <>Not used as a valid taxon in the original description</>;
    case "AsEmendedBy":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          As emended by <ModelLink model={tag.name} />
        </>
      );
    case "RerankingOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Reranking of <ModelLink model={tag.name} />
        </>
      );
    case "UnavailableVersionOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Unavailable version of <ModelLink model={tag.name} />
        </>
      );
    case "PermanentlyReplacedSecondaryHomonymOf":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Permanently replaced secondary homonym of <ModelLink model={tag.name} />
          {tag.replacementName && (
            <>
              {"; replacement: "}
              <ModelLink model={tag.replacementName} />
            </>
          )}
          {tag.optionalSource && (
            <>
              {" ("}
              <ModelLink model={tag.optionalSource} />
              {")"}
            </>
          )}
          {tag.pageLink && (
            <>
              {" "}
              (<a href={tag.pageLink}>view page</a>)
            </>
          )}
        </>
      );
    default:
      return null;
  }
}

class NameTags extends React.Component<{ name: NameTags_name }> {
  render() {
    const { name } = this.props;
    if (!name.tags || name.tags.length === 0) {
      return null;
    }
    return (
      <ul>
        {name.tags.map(
          (tag) =>
            tag && (
              <li key={tag.__typename}>
                <Tag tag={tag} />
                {"comment" in tag && tag.comment && (
                  <>
                    {" (comment: "}
                    <InlineMarkdown source={tag.comment} />
                    {")"}
                  </>
                )}
              </li>
            ),
        )}
      </ul>
    );
  }
}

export default createFragmentContainer(NameTags, {
  name: graphql`
    fragment NameTags_name on Name {
      tags {
        __typename
        ... on AsEmendedBy {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on RerankingOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on UnavailableVersionOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on PermanentlyReplacedSecondaryHomonymOf {
          name {
            ...ModelLink_model
          }
          replacementName {
            ...ModelLink_model
          }
          optionalSource {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on Conserved {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on FullySuppressedBy {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on IncorrectOriginalSpellingOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on IncorrectSubsequentSpellingOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on JustifiedEmendationOf {
          name {
            ...ModelLink_model
          }
          justification
          comment
        }
        ... on MandatoryChangeOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NomenNovumFor {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NomenOblitum {
          name {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on PreoccupiedBy {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on PrimaryHomonymOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on SecondaryHomonymOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NotPreoccupiedBy {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on PartiallySuppressedBy {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on Rejected {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on ReversalOfPriority {
          over {
            ...ModelLink_model
          }
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on SelectionOfPriority {
          overName {
            ...ModelLink_model
          }
          overCe {
            ...ModelLink_model
          }
          optionalSource {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on SelectionOfSpelling {
          optionalSource {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on SubsequentUsageOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NameCombinationOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MisidentificationOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on TakesPriorityOf {
          name {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on UnjustifiedEmendationOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on VariantOf {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on Condition {
          status
          comment
        }
        ... on ValidUse {
          source {
            ...ModelLink_model
          }
          comment
        }
        ... on VarietyOrForm {
          comment
        }
        ... on NotUsedAsValid {
          comment
        }
      }
    }
  `,
});
