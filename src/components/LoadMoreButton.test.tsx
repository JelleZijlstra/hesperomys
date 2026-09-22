import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import LoadMoreButton from "./LoadMoreButton";

test("prevents duplicate requests, shows failure, and lets the reader retry", () => {
  let complete: (error?: Error) => void = () => {};
  const relay: any = {
    hasMore: jest.fn(() => true),
    isLoading: () => false,
    loadMore: jest.fn((count, callback) => {
      complete = callback;
    }),
  };
  const view = render(<LoadMoreButton relay={relay} numToLoad={100} />);
  fireEvent.click(view.getByText("Load more"));
  expect(view.getByText("Loading…")).toBeDisabled();
  fireEvent.click(view.getByText("Loading…"));
  expect(relay.loadMore).toHaveBeenCalledTimes(1);
  expect(relay.loadMore).toHaveBeenLastCalledWith(100, expect.any(Function));
  act(() => complete(new Error("offline")));
  expect(view.getByRole("alert")).toHaveTextContent("More records could not be loaded");
  fireEvent.click(view.getByText("Try again"));
  expect(relay.loadMore).toHaveBeenCalledTimes(2);
  relay.hasMore.mockReturnValue(false);
  act(() => complete());
  expect(view.queryByRole("button")).toBeNull();
});
