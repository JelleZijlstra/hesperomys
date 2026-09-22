import { getDocumentationAssetUrl } from "./documentationUrl";

const originalGraphQLUrl = process.env.REACT_APP_GRAPHQL_URL;
const note = "research-notes/geomys-breviceps-brazensis";

beforeEach(() => {
  delete process.env.REACT_APP_GRAPHQL_URL;
});

afterEach(() => {
  if (originalGraphQLUrl === undefined) {
    delete process.env.REACT_APP_GRAPHQL_URL;
  } else {
    process.env.REACT_APP_GRAPHQL_URL = originalGraphQLUrl;
  }
});

test.each([
  ["/docs/research-notes/localities.svg", "localities.svg"],
  ["localities.csv", "localities.csv"],
  ["./localities-map.html#map", "localities-map.html#map"],
  ["localities.svg?v=2", "localities.svg?v=2"],
])("loads documentation attachment %s from the development backend", (uri, file) => {
  expect(getDocumentationAssetUrl(uri, note)).toBe(
    `http://localhost:8080/docs/research-notes/${file}`,
  );
});

test("uses the configured backend origin", () => {
  process.env.REACT_APP_GRAPHQL_URL = "https://hesperomys.com/graphql";
  expect(getDocumentationAssetUrl("localities.svg", note)).toBe(
    "https://hesperomys.com/docs/research-notes/localities.svg",
  );
});

test("supports a same-origin backend", () => {
  process.env.REACT_APP_GRAPHQL_URL = "/graphql";
  expect(getDocumentationAssetUrl("localities.svg", note)).toBe(
    `${window.location.origin}/docs/research-notes/localities.svg`,
  );
});

test.each([
  "/a/63943",
  "/docs/research-notes",
  "#assessment",
  "https://example.com/docs/map.svg",
  "//example.com/docs/map.svg",
  "mailto:contact@example.com",
  "",
])("preserves links other than documentation attachments: %s", (uri) => {
  expect(getDocumentationAssetUrl(uri, note)).toBe(uri);
});
