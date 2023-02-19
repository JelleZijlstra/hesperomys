import React, { useCallback } from "react";
import { OpenButtonMutation } from "./__generated__/OpenButtonMutation.graphql";
import { useMutation } from "react-relay";
import graphql from "babel-plugin-relay/macro";

export default function OpenButton({ articleId }: { articleId: number }) {
  const params = new URLSearchParams(window.location.search);
  const [commitMutation, isMutationInFlight] = useMutation<OpenButtonMutation>(graphql`
    mutation OpenButtonMutation($articleId: Int!) {
      openArticle(articleId: $articleId) {
        ok
      }
    }
  `);
  const onClick = useCallback(() => {
    commitMutation({ variables: { articleId } });
  }, [articleId, commitMutation]);
  if (!params.get("local")) {
    return null;
  }

  return (
    <button onClick={onClick} disabled={isMutationInFlight}>
      Open
    </button>
  );
}
