import { CitationGroupSubtitle_citationGroup } from "./__generated__/CitationGroupSubtitle_citationGroup.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class CitationGroupSubtitle extends React.Component<{
  citationGroup: CitationGroupSubtitle_citationGroup;
}> {
  render() {
    const { cgType, region } = this.props.citationGroup;
    switch (cgType) {
      case "BOOK":
        return (
          <>
            City
            {region && (
              <>
                {" in "}
                <ModelLink model={region} />
              </>
            )}
          </>
        );
      case "JOURNAL":
        return (
          <>
            Journal
            {region && (
              <>
                {" published in "}
                <ModelLink model={region} />
              </>
            )}
          </>
        );
      case "THESIS":
        return (
          <>
            University
            {region && (
              <>
                {" in "}
                <ModelLink model={region} />
              </>
            )}
          </>
        );
      default:
        return <>{cgType.toLowerCase()}</>;
    }
  }
}

export default createFragmentContainer(CitationGroupSubtitle, {
  citationGroup: graphql`
    fragment CitationGroupSubtitle_citationGroup on CitationGroup {
      cgType: type
      region {
        ...ModelLink_model
      }
    }
  `,
});
