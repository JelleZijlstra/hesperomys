import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import FullSearch from "./FullSearch";

jest.mock("react-relay", () => ({
  QueryRenderer: ({ render: show }: any) => show({ props: {}, error: null }),
}));
jest.mock("./SearchResults", () => ({ queryString }: any) => (
  <p>Results for {queryString}</p>
));

test("updates the URL and restores results and input on Back, Forward, and a fresh visit", () => {
  const history = createMemoryHistory({ initialEntries: ["/search?q=Rodentia"] });
  const view = render(
    <Router history={history}>
      <FullSearch />
    </Router>,
  );
  const input = view.getByLabelText("Search article full text");
  fireEvent.change(input, { target: { value: "Chiroptera" } });
  fireEvent.click(view.getByText("Search", { selector: "button" }));
  expect(history.location.search).toBe("?q=Chiroptera");
  expect(view.getByText("Results for Chiroptera")).toBeInTheDocument();
  act(() => history.goBack());
  expect(input).toHaveValue("Rodentia");
  expect(view.getByText("Results for Rodentia")).toBeInTheDocument();
  act(() => history.goForward());
  expect(input).toHaveValue("Chiroptera");
  view.unmount();
  const fresh = createMemoryHistory({
    initialEntries: [history.location.pathname + history.location.search],
  });
  const restored = render(
    <Router history={fresh}>
      <FullSearch />
    </Router>,
  );
  expect(restored.getByLabelText("Search article full text")).toHaveValue("Chiroptera");
  expect(restored.getByText("Results for Chiroptera")).toBeInTheDocument();
});

test("clearing a search removes its results and query parameter", () => {
  const history = createMemoryHistory({ initialEntries: ["/search?q=Rodentia"] });
  const view = render(
    <Router history={history}>
      <FullSearch />
    </Router>,
  );
  fireEvent.change(view.getByLabelText("Search article full text"), {
    target: { value: "   " },
  });
  fireEvent.click(view.getByText("Search", { selector: "button" }));
  expect(history.location.search).toBe("");
  expect(view.queryByText("Results for Rodentia")).toBeNull();
});
