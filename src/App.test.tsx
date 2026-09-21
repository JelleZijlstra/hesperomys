import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders the database home page", () => {
  const { getByText } = render(<App />);
  expect(getByText("Hesperomys", { selector: "h1" })).toBeInTheDocument();
  expect(getByText("Hesperomys", { selector: "a i" }).closest("a")).toHaveAttribute(
    "href",
    "/",
  );
});

test("shows the not-found page for unmatched routes", () => {
  window.history.replaceState({}, "", "/missing-page");
  try {
    const { getByText } = render(<App />);
    expect(getByText("Page not found", { selector: "h1" })).toBeInTheDocument();
    expect(getByText("Browse the database")).toHaveAttribute("href", "/");
  } finally {
    window.history.replaceState({}, "", "/");
  }
});
