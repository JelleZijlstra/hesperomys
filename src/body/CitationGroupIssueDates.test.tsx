import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { IssueDates } from "./CitationGroupIssueDates";

jest.mock(
  "react-markdown",
  () =>
    ({ children }: any) =>
      children,
);

test("shows the complete total, preserves the source calendar, and loads another batch", () => {
  const citationGroup: any = {
    numIssueDateSet: 1519,
    issueDateSet: {
      edges: [
        {
          node: {
            id: "last",
            date: "1900-02-29",
            volume: "20",
            tags: [{ __typename: "CalendarID", calendar: "julian" }],
          },
        },
      ],
    },
  };
  const relay: any = {
    hasMore: () => true,
    isLoading: () => false,
    loadMore: jest.fn(),
  };
  const view = render(<IssueDates citationGroup={citationGroup} relay={relay} />);
  expect(view.getByRole("status")).toHaveTextContent("Showing 1 of 1519 issue dates.");
  expect(view.getByText("29 February 1900 (Julian calendar)")).toBeInTheDocument();
  fireEvent.click(view.getByText("Load more"));
  expect(relay.loadMore).toHaveBeenCalledWith(100, expect.any(Function));
});
