import { NameComplexBody_nameComplex } from "./__generated__/NameComplexBody_nameComplex.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameComplexNames from "../lists/NameComplexNames";
import Table from "../components/Table";

class NameComplexBody extends React.Component<{
  nameComplex: NameComplexBody_nameComplex;
}> {
  render() {
    const { nameComplex } = this.props;
    return (
      <>
        <Table
          data={[
            ["Stem", nameComplex.stem],
            ["Based on ICZN Art.", <>{nameComplex.codeArticle}</>],
            ["Grammatical gender", <>{nameComplex.gender}</>],
            [
              "Formation of stem",
              <>
                -{nameComplex.stemRemove}+{nameComplex.stemAdd}
              </>,
            ],
            ["Comment", nameComplex.comment],
          ]}
        />
        <NameComplexNames nameComplex={nameComplex} />
      </>
    );
  }
}

export default createFragmentContainer(NameComplexBody, {
  nameComplex: graphql`
    fragment NameComplexBody_nameComplex on NameComplex {
      stem
      codeArticle
      gender
      stemRemove
      stemAdd
      comment
      ...NameComplexNames_nameComplex
    }
  `,
});
