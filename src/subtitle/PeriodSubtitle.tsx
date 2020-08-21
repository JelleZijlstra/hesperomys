import { PeriodSubtitle_period } from "./__generated__/PeriodSubtitle_period.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import { toTitle } from "../utils";

const RANK_TO_TEXT = new Map([
  ["other_lithostratigraphy", "Informal lithostratigraphic unit"],
  ["other_chronostratigraphy", "Informal chronostratigraphic unit"],
]);
const SYSTEM_TO_TEXT = new Map([
  ["gts", "Geologic Time Scale"],
  ["nalma", "North American Land Mammal Ages"],
  ["elma", "European Land Mammal Ages"],
  ["alma", "Asian Land Mammal Ages"],
  ["salma", "South American Land Mammal Ages"],
  ["lithostratigraphy", "lithostratigraphy"],
  ["aulma", "Australian Land Mammal Ages"],
  ["local_biostratigraphy", "local biostratigraphy"],
]);

class PeriodSubtitle extends React.Component<{
  period: PeriodSubtitle_period;
}> {
  render() {
    const { system, rank } = this.props.period;
    let rankText;
    if (RANK_TO_TEXT.has(rank)) {
      rankText = RANK_TO_TEXT.get(rank);
    } else {
      rankText = toTitle(rank);
    }
    return (
      <>
        {rankText} {SYSTEM_TO_TEXT.get(system)}
      </>
    );
  }
}

export default createFragmentContainer(PeriodSubtitle, {
  period: graphql`
    fragment PeriodSubtitle_period on Period {
      rank
      system
    }
  `,
});
