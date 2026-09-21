import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NameBody from "./NameBody";

jest.mock(
  "react-markdown",
  () =>
    ({ children }: { children: React.ReactNode }) =>
      children,
);

jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  createFragmentContainer: (component: any) => component,
  createPaginationContainer: () => () => null,
}));

// Supply fragment data directly so these tests exercise the complete page's
// selection of which type tags to display, without a GraphQL server.
function renderName(typeTags: any[]) {
  const name: any = {
    rootName: "test",
    group: "species",
    nomenclatureStatus: "available",
    authorTags: [],
    nameTags: [],
    taxon: {},
    numericYear: null,
    pageDescribed: null,
    typeTags,
  };
  return render(
    <MemoryRouter>
      <NameBody name={name} />
    </MemoryRouter>,
  );
}

test("shows partial localities even without a primary type locality", () => {
  const { getByText } = renderName([
    {
      __typename: "PartialTypeLocalityN",
      location: {
        __typename: "Location",
        oid: 123,
        callSign: "L",
        locationName: "Example locality",
        regionPath: [],
      },
    },
  ]);
  expect(getByText("Type locality", { selector: "h3" })).toBeInTheDocument();
  expect(getByText("Part of the type locality:")).toBeInTheDocument();
  expect(getByText("Example locality", { selector: "a" })).toHaveAttribute(
    "href",
    "/l/123",
  );
});

test("shows structured source citations on the name page", () => {
  const { getByText } = renderName([
    {
      __typename: "StructuredVerbatimCitationN",
      volume: "3",
      issue: "2",
      startPage: "17",
      endPage: "20",
      citationUrl: "https://example.org/source",
    },
  ]);
  expect(
    getByText(/Citation as given: volume 3, issue 2, pages 17–20/),
  ).toBeInTheDocument();
  expect(getByText("source link", { selector: "a" })).toHaveAttribute(
    "href",
    "https://example.org/source",
  );
});
