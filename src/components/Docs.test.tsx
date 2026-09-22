import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Docs from "./Docs";

let mockState: any;
jest.mock("react-relay", () => ({
  QueryRenderer: ({ render: show }: any) => show(mockState),
}));
jest.mock("./HeaderNameSearch", () => () => null);
jest.mock("remark-gfm", () => () => {});
jest.mock(
  "react-markdown",
  () =>
    ({ children }: any) =>
      children,
);

test("missing documentation uses the full not-found page with one header", () => {
  mockState = { props: { documentation: null }, error: null };
  const view = render(
    <MemoryRouter initialEntries={["/docs/missing"]}>
      <Docs path="missing" />
    </MemoryRouter>,
  );
  expect(view.getByText("Page not found", { selector: "h1" })).toBeInTheDocument();
  expect(view.getByText("/docs/missing")).toBeInTheDocument();
  expect(view.getAllByText("Hesperomys")).toHaveLength(1);
});

test("a documentation request failure can be retried without a full reload", () => {
  const retry = jest.fn();
  mockState = { props: null, error: new Error("offline"), retry };
  const view = render(
    <MemoryRouter>
      <Docs path="home" />
    </MemoryRouter>,
  );
  expect(
    view.getByText("Unable to load this page", { selector: "h1" }),
  ).toBeInTheDocument();
  fireEvent.click(view.getByText("Try again"));
  expect(retry).toHaveBeenCalledTimes(1);
});
