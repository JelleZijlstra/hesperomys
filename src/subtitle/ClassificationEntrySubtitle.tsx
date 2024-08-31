import { ClassificationEntrySubtitle_classificationEntry } from "./__generated__/ClassificationEntrySubtitle_classificationEntry.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class ClassificationEntrySubtitle extends React.Component<{
  classificationEntry: ClassificationEntrySubtitle_classificationEntry;
}> {
  render() {
    const { article } = this.props.classificationEntry;
    return (
      <>
        According to <ModelLink model={article} />
      </>
    );
  }
}

export default createFragmentContainer(ClassificationEntrySubtitle, {
  classificationEntry: graphql`
    fragment ClassificationEntrySubtitle_classificationEntry on ClassificationEntry {
      article {
        ...ModelLink_model
      }
    }
  `,
});
