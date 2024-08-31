import { ClassificationEntryTitle_classificationEntry } from "./__generated__/ClassificationEntryTitle_classificationEntry.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import MaybeItalics, { RANK_TO_GROUP } from "../components/MaybeItalics";
import { Rank } from "../body/Rank";

class ClassificationEntryTitle extends React.Component<{
  classificationEntry: ClassificationEntryTitle_classificationEntry;
}> {
  render() {
    const ce = this.props.classificationEntry;
    const rank = ce.ceRank === "synonym" ? ce.ceParent?.ceRank || "other" : ce.ceRank;
    const group = RANK_TO_GROUP.get(rank) || "high";

    return (
      <>
        <MaybeItalics group={group} name={ce.ceName} /> (<Rank rank={ce.ceRank} />)
      </>
    );
  }
}

export default createFragmentContainer(ClassificationEntryTitle, {
  classificationEntry: graphql`
    fragment ClassificationEntryTitle_classificationEntry on ClassificationEntry {
      ceName: name
      ceRank: rank
      ceParent: parent {
        ceRank: rank
      }
    }
  `,
});
