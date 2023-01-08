import { PageTitle_model } from "./__generated__/PageTitle_model.graphql";

import React, { useEffect } from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import Title from "../title/Title";

function PageTitle({ model }: { model: PageTitle_model }) {
  const { pageTitle } = model;
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  return (
    <>
      <Title model={model} /> ({model.callSign}#{model.oid})
    </>
  );
}

export default createFragmentContainer(PageTitle, {
  model: graphql`
    fragment PageTitle_model on Model {
      __typename
      callSign
      oid
      pageTitle
      ...Title_model
    }
  `,
});
