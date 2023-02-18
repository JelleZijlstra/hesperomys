import { SpeciesNameComplexBody_speciesNameComplex } from "./__generated__/SpeciesNameComplexBody_speciesNameComplex.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import SpeciesNameComplexNames from "../lists/SpeciesNameComplexNames";
import Table from "../components/Table";
import InlineMarkdown from "../components/InlineMarkdown";

class SpeciesNameComplexBody extends React.Component<{
  speciesNameComplex: SpeciesNameComplexBody_speciesNameComplex;
}> {
  render() {
    const { speciesNameComplex } = this.props;
    return (
      <>
        <Table
          data={[
            ["Stem", speciesNameComplex.stem],
            ["Kind", <>{speciesNameComplex.sncKind}</>],
            ["Masculine ending", <>-{speciesNameComplex.masculineEnding}</>],
            ["Femine ending", <>-{speciesNameComplex.feminineEnding}</>],
            ["Neuter ending", <>-{speciesNameComplex.neuterEnding}</>],
            [
              "Comment",
              speciesNameComplex.comment ? (
                <InlineMarkdown source={speciesNameComplex.comment} />
              ) : null,
            ],
          ]}
        />
        <SpeciesNameComplexNames speciesNameComplex={speciesNameComplex} />
      </>
    );
  }
}

export default createFragmentContainer(SpeciesNameComplexBody, {
  speciesNameComplex: graphql`
    fragment SpeciesNameComplexBody_speciesNameComplex on SpeciesNameComplex {
      stem
      sncKind: kind
      masculineEnding
      feminineEnding
      neuterEnding
      comment
      ...SpeciesNameComplexNames_speciesNameComplex
    }
  `,
});
