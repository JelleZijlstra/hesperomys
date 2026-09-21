import { NameTags_name } from "./__generated__/NameTags_name.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";
import InlineMarkdown from "./InlineMarkdown";

function Tag({ tag }: { tag: NameTags_name["nameTags"][0] }) {
  if (!tag) {
    return null;
  }
  switch (tag.__typename) {
    case "ConservedN":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Placed on the Official List by <ModelLink model={tag.opinion} />
        </>
      );
    case "FullySuppressedByN":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Fully suppressed by <ModelLink model={tag.opinion} />
        </>
      );
    case "IncorrectOriginalSpellingOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Incorrect original spelling of <ModelLink model={tag.name} />
        </>
      );
    case "IncorrectSubsequentSpellingOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Incorrect subsequent spelling of <ModelLink model={tag.name} />
        </>
      );
    case "JustifiedEmendationOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Justified emendation (reason: {tag.justification}) of{" "}
          <ModelLink model={tag.name} />
        </>
      );
    case "MandatoryChangeOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Mandatory change of <ModelLink model={tag.name} />
        </>
      );
    case "NomenNovumForN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Nomen novum for <ModelLink model={tag.name} />
        </>
      );
    case "NomenOblitumN":
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
    case "PreoccupiedByN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Preoccupied by <ModelLink model={tag.name} />
        </>
      );
    case "PrimaryHomonymOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Primary homonym of <ModelLink model={tag.name} />
        </>
      );
    case "SecondaryHomonymOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Secondary homonym of <ModelLink model={tag.name} />
        </>
      );
    case "PartiallySuppressedByN":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Partially suppressed by <ModelLink model={tag.opinion} />
        </>
      );
    case "RejectedN":
      if (!tag.opinion) {
        return null;
      }
      return (
        <>
          Rejected by <ModelLink model={tag.opinion} />
        </>
      );
    case "ReversalOfPriorityN":
      if (!tag.opinion || !tag.over) {
        return null;
      }
      return (
        <>
          Given priority over <ModelLink model={tag.over} /> by{" "}
          <ModelLink model={tag.opinion} />
        </>
      );
    case "SelectionOfPriorityN":
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
    case "SelectionOfSpellingN":
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
    case "SubsequentUsageOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Subsequent usage of <ModelLink model={tag.name} />
        </>
      );
    case "MisidentificationOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Misidentification of <ModelLink model={tag.name} />
        </>
      );
    case "NameCombinationOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Name combination of <ModelLink model={tag.name} />
        </>
      );
    case "TakesPriorityOfN":
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
    case "UnjustifiedEmendationOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Unjustified emendation of <ModelLink model={tag.name} />
        </>
      );
    case "VariantOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Spelling variant of <ModelLink model={tag.name} />
        </>
      );
    case "NotPreoccupiedByN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Not preoccupied by (but similar to) <ModelLink model={tag.name} />
        </>
      );
    case "ConditionN":
      return <>{tag.status.replace(/_/g, " ")}</>;
    case "ValidUseN":
      if (!tag.source) {
        return null;
      }
      return (
        <>
          Used as a valid taxon by <ModelLink model={tag.source} />
        </>
      );
    case "VarietyOrFormN":
      return <>Originally described as a "variety" or "form"</>;
    case "NotUsedAsValidN":
      return <>Not used as a valid taxon in the original description</>;
    case "AsEmendedByN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          As emended by <ModelLink model={tag.name} />
        </>
      );
    case "RerankingOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Reranking of <ModelLink model={tag.name} />
        </>
      );
    case "UnavailableVersionOfN":
      if (!tag.name) {
        return null;
      }
      return (
        <>
          Unavailable version of <ModelLink model={tag.name} />
        </>
      );
    case "PermanentlyReplacedSecondaryHomonymOfN":
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
    if (!name.nameTags || name.nameTags.length === 0) {
      return null;
    }
    return (
      <ul>
        {name.nameTags.map(
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
      nameTags: tags {
        __typename
        ... on AsEmendedByN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on RerankingOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on UnavailableVersionOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on PermanentlyReplacedSecondaryHomonymOfN {
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
        ... on ConservedN {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on FullySuppressedByN {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on IncorrectOriginalSpellingOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on IncorrectSubsequentSpellingOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on JustifiedEmendationOfN {
          name {
            ...ModelLink_model
          }
          justification
          comment
        }
        ... on MandatoryChangeOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NomenNovumForN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NomenOblitumN {
          name {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on PreoccupiedByN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on PrimaryHomonymOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on SecondaryHomonymOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NotPreoccupiedByN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on PartiallySuppressedByN {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on RejectedN {
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on ReversalOfPriorityN {
          over {
            ...ModelLink_model
          }
          opinion {
            ...ModelLink_model
          }
          comment
        }
        ... on SelectionOfPriorityN {
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
        ... on SelectionOfSpellingN {
          optionalSource {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on SubsequentUsageOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on NameCombinationOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on MisidentificationOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on TakesPriorityOfN {
          name {
            ...ModelLink_model
          }
          comment
          pageLink
        }
        ... on UnjustifiedEmendationOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on VariantOfN {
          name {
            ...ModelLink_model
          }
          comment
        }
        ... on ConditionN {
          status
          comment
        }
        ... on ValidUseN {
          source {
            ...ModelLink_model
          }
          comment
        }
        ... on VarietyOrFormN {
          comment
        }
        ... on NotUsedAsValidN {
          comment
        }
      }
    }
  `,
});
