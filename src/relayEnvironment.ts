import { Environment, Network, RecordSource, Store } from "relay-runtime";

export function getGraphQLUrl() {
  if (process.env.REACT_APP_GRAPHQL_URL) {
    return process.env.REACT_APP_GRAPHQL_URL;
  }
  return window.location.hostname.endsWith("hesperomys.com")
    ? "/graphql"
    : "http://localhost:8080/graphql";
}

export function fetchQuery(operation: any, variables: any) {
  return fetch(getGraphQLUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`The server returned HTTP ${response.status}.`);
    }
    const result = await response.json();
    // Relay can otherwise turn a failed nullable model into a misleading 404.
    if (result.errors && result.errors.length > 0) {
      throw new Error(
        result.errors.map((error: { message: string }) => error.message).join("; "),
      );
    }
    return result;
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
