import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { SearchBox } from "./SearchBox";

const originalFetch = window.fetch;
let open: jest.SpyInstance;
beforeEach(() => {
  window.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { modelCls: { autocomplete: ["Mus musculus"] } } }),
  });
  open = jest.spyOn(window, "open").mockReturnValue({ focus: jest.fn() } as any);
});
afterEach(() => {
  window.fetch = originalFetch;
  open.mockRestore();
});

test.each(["keyboard", "mouse"])(
  "opens an autocomplete result once using the %s",
  async (method) => {
    const history = createMemoryHistory();
    const view = render(
      <Router history={history}>
        <SearchBox modelCls={{ callSign: "N", name: "Name" } as any} />
      </Router>,
    );
    const input = view.getByPlaceholderText("Pick a name");
    fireEvent.change(input, { target: { value: "Mus" } });
    const option = await view.findByText(
      (_text, element) =>
        element?.getAttribute("role") === "option" &&
        element.textContent === "Mus musculus",
    );
    if (method === "keyboard") {
      fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
      fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    } else {
      fireEvent.click(option);
    }
    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith("/n/Mus_musculus", "_blank");
  },
);

test("opens in the current tab if the browser blocks a new tab", async () => {
  open.mockReturnValue(null);
  const history = createMemoryHistory();
  const view = render(
    <Router history={history}>
      <SearchBox modelCls={{ callSign: "N", name: "Name" } as any} />
    </Router>,
  );
  const input = view.getByPlaceholderText("Pick a name");
  fireEvent.change(input, { target: { value: "Mus" } });
  await view.findByText(
    (_text, element) =>
      element?.getAttribute("role") === "option" &&
      element.textContent === "Mus musculus",
  );
  fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
  fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
  expect(history.location.pathname).toBe("/n/Mus_musculus");
});
