import { Environment, Network, RecordSource, Store } from "relay-runtime";

export function getGraphQLUrl() {
  if (process.env.REACT_APP_GRAPHQL_URL) {
    return process.env.REACT_APP_GRAPHQL_URL;
  }
  return window.location.hostname.endsWith("hesperomys.com")
    ? "/graphql"
    : "http://localhost:8080/graphql";
}

function fetchQuery(operation: any, variables: any) {
  return fetch(getGraphQLUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
