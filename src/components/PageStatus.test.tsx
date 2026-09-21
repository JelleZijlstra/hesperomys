import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PageStatus from "./PageStatus";

jest.mock("./HeaderNameSearch", () => () => null);

test("shows a useful missing-page message with navigation", () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={["/l/999999999"]}>
      <PageStatus kind="not-found" />
    </MemoryRouter>,
  );
  expect(getByText("404")).toBeInTheDocument();
  expect(getByText("Page not found", { selector: "h1" })).toBeInTheDocument();
  expect(getByText("/l/999999999")).toBeInTheDocument();
  expect(getByText("Browse the database")).toHaveAttribute("href", "/");
  expect(document.title).toBe("Page not found - Hesperomys");
});

test("shows load failures separately from missing pages", () => {
  const { getByText, queryByText } = render(
    <MemoryRouter initialEntries={["/l/29547"]}>
      <PageStatus kind="error" />
    </MemoryRouter>,
  );
  expect(getByText("Unable to load this page", { selector: "h1" })).toBeInTheDocument();
  expect(getByText("Try again")).toBeInTheDocument();
  expect(queryByText("404")).toBeNull();
});
