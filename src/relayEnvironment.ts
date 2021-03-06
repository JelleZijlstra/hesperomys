import { Environment, Network, RecordSource, Store } from "relay-runtime";

function fetchQuery(operation: any, variables: any) {
  const url = window.location.hostname.endsWith("hesperomys.com")
    ? "/graphql"
    : "http://localhost:8080/graphql";
  return fetch(url, {
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
