import React from "react";
import { act } from "react-dom/test-utils";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FamiliesByOrder from "./FamiliesByOrder";
import FamilyByGenus from "./FamilyByGenus";
import OrderByFamily from "./OrderByFamily";
import SpeciesByGenus from "./SpeciesByGenus";
import GeneraByFamily from "./GeneraByFamily";
import { Geography, filterGroupedFamilies, scopedStorageKey } from "./geography";

const geo: Geography = {
  version: 1,
  continents: ["Asia", "North America", "Antarctica"],
  genera: { Mus: ["Asia", "North America"], Apodemus: ["Asia"] },
  families: {
    Muridae: ["Asia", "North America"],
    Cricetidae: ["Asia"],
    Felidae: ["Asia"],
  },
  species: { Mus: { musculus: ["North America"], caroli: ["Asia"] } },
  source: {
    name: "MDD",
    file: "fixture.csv",
    sha256: "fixture",
    generated_at: "2026-08-27",
  },
};
const grouped = [
  {
    family: "Muridae",
    groups: [
      {
        name: "Murinae",
        tribes: [
          { name: "Murini", genera: ["Mus"] },
          { name: "Apodemini", genera: ["Apodemus"] },
        ],
        unplaced_genera: [],
      },
    ],
  },
];
let files: Record<string, unknown>;
const originalFetch = window.fetch;

beforeEach(() => {
  window.localStorage.clear();
  files = {
    "geography.json": geo,
    "genus_family.json": [
      { genus: "Mus", family: "Muridae" },
      { genus: "Apodemus", family: "Muridae" },
    ],
    "order_families.json": [
      { order: "Rodentia", families: ["Cricetidae", "Muridae"] },
      { order: "Carnivora", families: ["Felidae"] },
    ],
    "family_order.json": [
      { family: "Muridae", order: "Rodentia" },
      { family: "Felidae", order: "Carnivora" },
    ],
    "genus_species.json": [{ genus: "Mus", species: ["musculus", "caroli"] }],
    "family_genera.json": [{ family: "Muridae", genera: ["Mus", "Apodemus"] }],
    "family_genera_grouped.json": grouped,
  };
  window.fetch = jest.fn((url: string) =>
    Promise.resolve({
      ok: Boolean(files[url.split("/").pop() || ""]),
      json: () => Promise.resolve(files[url.split("/").pop() || ""]),
    }),
  ) as jest.Mock;
  jest.spyOn(Math, "random").mockReturnValue(0.99);
});

afterEach(() => {
  cleanup();
  window.fetch = originalFetch;
  jest.restoreAllMocks();
  jest.useRealTimers();
});

async function mount(component: React.ReactElement) {
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<MemoryRouter>{component}</MemoryRouter>);
  });
  return result!;
}

test("beginner game grades typed orders and preserves completion after reload", async () => {
  const view = await mount(<OrderByFamily />);
  fireEvent.change(view.getByLabelText("Order"), {
    target: { value: "Rodentia" },
  });
  fireEvent.click(view.getByText("Submit"));
  expect(view.getByText("1 / 1")).toBeInTheDocument();
  fireEvent.change(view.getByLabelText("Order"), {
    target: { value: "Carnivora" },
  });
  fireEvent.click(view.getByText("Submit"));
  expect(view.getByText(/All 2 prompts/)).toBeInTheDocument();
  view.unmount();
  const restored = await mount(<OrderByFamily />);
  expect(restored.getByText(/All 2 prompts/)).toBeInTheDocument();
});

test("game header keeps navigation and continent controls without explanatory paragraphs", async () => {
  const view = await mount(<OrderByFamily />);
  expect(view.getByText("← All games")).toBeInTheDocument();
  expect(view.getByLabelText("Continent")).toBeInTheDocument();
  expect(view.container.querySelector(".game-scope-controls p")).toBeNull();
});

test("order input offers case-insensitive typeahead and allows typed answers", async () => {
  const view = await mount(<OrderByFamily />);
  const input = view.getByLabelText("Order");
  expect(input.tagName).toBe("INPUT");
  expect(input).toHaveAttribute("type", "text");
  const list = view.container.querySelector("datalist")!;
  expect(input).toHaveAttribute("list", list.id);
  fireEvent.change(input, { target: { value: "roD" } });
  expect(list.querySelectorAll("option")).toHaveLength(1);
  expect(list.querySelector("option")).toHaveValue("Rodentia");
  fireEvent.change(input, { target: { value: "unknown" } });
  expect(list.querySelectorAll("option")).toHaveLength(0);
  fireEvent.change(input, { target: { value: "  RODENTIA  " } });
  fireEvent.click(view.getByText("Submit"));
  expect(view.getByText("1 / 1")).toBeInTheDocument();
  expect(input).toHaveValue("");
  expect(list.querySelectorAll("option")).toHaveLength(0);
  fireEvent.change(input, { target: { value: "Unknown" } });
  fireEvent.click(view.getByText("Submit"));
  expect(view.getByText("1 / 2")).toBeInTheDocument();
  expect(view.getByText(/Incorrect. Correct order: Carnivora/)).toBeInTheDocument();
});

test("order typeahead uses the selected continent's orders", async () => {
  window.localStorage.setItem("hesperomys.games.continent.v1", "North America");
  const view = await mount(<OrderByFamily />);
  const input = view.getByLabelText("Order");
  fireEvent.change(input, { target: { value: "Car" } });
  expect(view.container.querySelectorAll("datalist option")).toHaveLength(0);
  fireEvent.change(input, { target: { value: "Rod" } });
  expect(view.container.querySelector("datalist option")).toHaveValue("Rodentia");
});

test("worldwide saves survive continent switches and each continent has its own progress", async () => {
  const view = await mount(<FamilyByGenus />);
  fireEvent.change(view.getByLabelText("Family"), {
    target: { value: "Muridae" },
  });
  fireEvent.click(view.getByText("Submit"));
  const worldwide = window.localStorage.getItem("hesperomys.familyByGenus.v1");
  fireEvent.change(view.getByLabelText("Continent"), {
    target: { value: "North America" },
  });
  expect(view.getByText("0 / 0")).toBeInTheDocument();
  fireEvent.change(view.getByLabelText("Family"), {
    target: { value: "Muridae" },
  });
  fireEvent.click(view.getByText("Submit"));
  expect(view.getByText(/All 1 prompts/)).toBeInTheDocument();
  expect(window.localStorage.getItem("hesperomys.familyByGenus.v1")).toBe(worldwide);
  fireEvent.change(view.getByLabelText("Continent"), { target: { value: "" } });
  expect(view.getByText("1 / 1")).toBeInTheDocument();
  expect(view.queryByText(/All 1 prompts/)).not.toBeInTheDocument();
});

test("legacy Family by Genus saves retain the current prompt and score", async () => {
  window.localStorage.setItem(
    "hesperomys.familyByGenus.v1",
    JSON.stringify({
      version: 1,
      progress: {
        queue: [],
        retry: [],
        completed: ["Mus"],
        flawless: ["Mus"],
        currentGenus: "Apodemus",
        pass: 1,
        finished: false,
        correct: 1,
        attempts: 1,
      },
    }),
  );
  const view = await mount(<FamilyByGenus />);
  expect(view.getByText("Apodemus")).toBeInTheDocument();
  expect(view.getByText("1 / 1")).toBeInTheDocument();
});

test("species answers are restricted within a genus, including full binomials", async () => {
  window.localStorage.setItem("hesperomys.games.continent.v1", "North America");
  const view = await mount(<SpeciesByGenus />);
  fireEvent.change(view.getByLabelText("Species"), {
    target: { value: "Mus caroli" },
  });
  fireEvent.click(view.getByText("Submit"));
  expect(view.getByText("0 / 1")).toBeInTheDocument();
  fireEvent.change(view.getByLabelText("Species"), {
    target: { value: "Mus musculus" },
  });
  fireEvent.click(view.getByText("Submit"));
  expect(view.getByText(/All 1 genera/)).toBeInTheDocument();
  expect(view.getByText("1 / 2")).toBeInTheDocument();
});

test("family game removes out-of-region genera from answers and grouped hints", async () => {
  window.localStorage.setItem("hesperomys.games.continent.v1", "North America");
  const view = await mount(<GeneraByFamily />);
  expect(view.container.querySelectorAll(".genera-chip")).toHaveLength(1);
  fireEvent.change(view.getByLabelText("Genus"), {
    target: { value: "Apodemus" },
  });
  fireEvent.click(view.getByText("Submit"));
  expect(view.container.querySelectorAll(".genera-chip.found")).toHaveLength(0);
  fireEvent.change(view.getByLabelText("Genus"), { target: { value: "Mus" } });
  fireEvent.click(view.getByText("Submit"));
  expect(view.container.querySelectorAll(".genera-chip.found")).toHaveLength(1);
  expect(view.getByText("1 / 1")).toBeInTheDocument();
});

test("group filtering removes empty subfamilies, tribes and unplaced genera", () => {
  const families = [...grouped, { family: "Felidae", groups: [] }];
  expect(
    filterGroupedFamilies(families, [{ family: "Muridae", genera: ["Mus"] }]),
  ).toEqual({
    Muridae: {
      family: "Muridae",
      groups: [
        {
          name: "Murinae",
          tribes: [{ name: "Murini", genera: ["Mus"] }],
          unplaced_genera: [],
        },
      ],
    },
  });
});

test("empty continent shows an empty state without recording a zero-question victory", async () => {
  const view = await mount(<OrderByFamily />);
  fireEvent.change(view.getByLabelText("Continent"), {
    target: { value: "Antarctica" },
  });
  expect(view.getByText(/No taxa are available/)).toBeInTheDocument();
  expect(
    window.localStorage.getItem(
      scopedStorageKey("hesperomys.orderByFamily.v1", "Antarctica"),
    ),
  ).toBeNull();
});

test("hard mode never falls back to a different set when no large families remain", async () => {
  window.localStorage.setItem(
    "hesperomys.generaByFamily.v2",
    JSON.stringify({ version: 2, hardMode: true }),
  );
  const view = await mount(<GeneraByFamily />);
  expect(view.getByText(/No families with more than 10 genera/)).toBeInTheDocument();
  fireEvent.click(view.getByText("Turn off hard mode"));
  expect(view.getByLabelText("Genus")).toBeInTheDocument();
});

test("missing geography does not silently turn a regional game into worldwide play", async () => {
  window.localStorage.setItem("hesperomys.games.continent.v1", "North America");
  delete files["geography.json"];
  const view = await mount(<FamilyByGenus />);
  expect(view.getByText(/This continent is unavailable/)).toBeInTheDocument();
  expect(view.queryByLabelText("Family")).not.toBeInTheDocument();
  fireEvent.change(view.getByLabelText("Continent"), { target: { value: "" } });
  expect(view.getByLabelText("Family")).toBeInTheDocument();
});

test("failed game fetch shows an error and can be retried", async () => {
  const data = files["family_order.json"];
  delete files["family_order.json"];
  const view = await mount(<OrderByFamily />);
  expect(view.getByRole("alert")).toHaveTextContent("Unable to load this game");
  files["family_order.json"] = data;
  await act(async () => {
    fireEvent.click(view.getByText("Retry"));
  });
  expect(view.getByLabelText("Order")).toBeInTheDocument();
});

function enterFamily(view: ReturnType<typeof render>, value: string) {
  fireEvent.change(view.getByLabelText("Family"), { target: { value } });
  fireEvent.click(view.getByText("Submit"));
}

test("families by order accepts each family once, rejects other answers and restores progress", async () => {
  const view = await mount(<FamiliesByOrder />);
  expect(view.getByText("Rodentia")).toBeInTheDocument();
  enterFamily(view, "Felidae");
  expect(view.getByText(/No match for/)).toBeInTheDocument();
  expect(view.getByText("0 / 2")).toBeInTheDocument();
  enterFamily(view, "  mUrIdAe ");
  expect(view.getByText("1 / 2")).toBeInTheDocument();
  expect(view.container.querySelector(".genera-chip.found em")).toBeNull();
  enterFamily(view, "Muridae");
  expect(view.getByText(/You already entered/)).toBeInTheDocument();
  expect(view.getByText("1 / 2")).toBeInTheDocument();
  fireEvent.click(view.getByText("Hint"));
  expect(view.getByText("C_________")).toBeInTheDocument();
  view.unmount();
  const restored = await mount(<FamiliesByOrder />);
  expect(restored.getByText("1 / 2")).toBeInTheDocument();
  expect(restored.getByText("C_________")).toBeInTheDocument();
  const saved = JSON.parse(
    window.localStorage.getItem("hesperomys.familiesByOrder.v1")!,
  );
  expect(saved.normal.currentFlawed).toBe(true);
});

test("families by order retries hinted and skipped orders until flawless and retains completion", async () => {
  jest.useFakeTimers();
  const view = await mount(<FamiliesByOrder />);
  fireEvent.click(view.getByText("Hint"));
  enterFamily(view, "Cricetidae");
  enterFamily(view, "Muridae");
  expect(view.getAllByText(/retry later/).length).toBeGreaterThan(0);
  act(() => {
    jest.advanceTimersByTime(800);
  });
  expect(view.getByText("Carnivora")).toBeInTheDocument();
  fireEvent.click(view.getByText("Skip"));
  expect(view.getByText("Rodentia")).toBeInTheDocument();
  enterFamily(view, "Muridae");
  enterFamily(view, "Cricetidae");
  act(() => {
    jest.advanceTimersByTime(800);
  });
  expect(view.getByText("Carnivora")).toBeInTheDocument();
  enterFamily(view, "Felidae");
  act(() => {
    jest.advanceTimersByTime(800);
  });
  expect(
    view.getByText(/All 2 orders have been completed flawlessly/),
  ).toBeInTheDocument();
  view.unmount();
  const restored = await mount(<FamiliesByOrder />);
  expect(
    restored.getByText(/All 2 orders have been completed flawlessly/),
  ).toBeInTheDocument();
  fireEvent.click(restored.getByText("Progress"));
  fireEvent.click(restored.getByText("Clear progress"));
  fireEvent.click(restored.getByText("Done"));
  expect(restored.getByText("0 / 2")).toBeInTheDocument();
});

test("families by order filters required families, drops empty orders and isolates regional saves", async () => {
  jest.useFakeTimers();
  const view = await mount(<FamiliesByOrder />);
  enterFamily(view, "Cricetidae");
  const worldwide = window.localStorage.getItem("hesperomys.familiesByOrder.v1");
  fireEvent.change(view.getByLabelText("Continent"), {
    target: { value: "North America" },
  });
  expect(view.getByText("0 / 1")).toBeInTheDocument();
  enterFamily(view, "Cricetidae");
  expect(view.getByText(/No match for/)).toBeInTheDocument();
  enterFamily(view, "Muridae");
  act(() => {
    jest.advanceTimersByTime(800);
  });
  // The rejected out-of-region family requires a retry of the one remaining order.
  enterFamily(view, "Muridae");
  act(() => {
    jest.advanceTimersByTime(800);
  });
  expect(
    view.getByText(/All 1 orders have been completed flawlessly/),
  ).toBeInTheDocument();
  expect(window.localStorage.getItem("hesperomys.familiesByOrder.v1")).toBe(worldwide);
  fireEvent.change(view.getByLabelText("Continent"), { target: { value: "" } });
  expect(view.getByText("1 / 2")).toBeInTheDocument();
  fireEvent.change(view.getByLabelText("Continent"), {
    target: { value: "Antarctica" },
  });
  expect(view.getByText(/No taxa are available/)).toBeInTheDocument();
});

test("families by order cancels pending completion when changing continent", async () => {
  jest.useFakeTimers();
  const view = await mount(<FamiliesByOrder />);
  enterFamily(view, "Cricetidae");
  enterFamily(view, "Muridae");
  fireEvent.change(view.getByLabelText("Continent"), {
    target: { value: "North America" },
  });
  act(() => {
    jest.advanceTimersByTime(800);
  });
  expect(view.getByText("0 / 1")).toBeInTheDocument();
  expect(view.getByText("Rodentia")).toBeInTheDocument();
});

test("families by order keeps normal and hard progress separate and applies the regional threshold", async () => {
  files["order_families.json"] = [
    {
      order: "Rodentia",
      families: Array.from({ length: 11 }, (_, i) => `Family${i}`),
    },
    { order: "Carnivora", families: ["Felidae"] },
  ];
  const view = await mount(<FamiliesByOrder />);
  enterFamily(view, "Family0");
  fireEvent.click(view.getByText("Progress"));
  fireEvent.click(view.getByLabelText(/Hard mode/));
  fireEvent.click(view.getByText("Done"));
  expect(view.getByText("0 / 11")).toBeInTheDocument();
  enterFamily(view, "Family1");
  fireEvent.click(view.getByText("Progress"));
  fireEvent.click(view.getByLabelText(/Hard mode/));
  fireEvent.click(view.getByText("Done"));
  expect(view.container.querySelector(".genera-chip.found")).toHaveTextContent(
    "Family0",
  );
  fireEvent.change(view.getByLabelText("Continent"), {
    target: { value: "Asia" },
  });
  fireEvent.click(view.getByText("Progress"));
  fireEvent.click(view.getByLabelText(/Hard mode/));
  fireEvent.click(view.getByText("Done"));
  expect(view.getByText(/No orders with more than 10 families/)).toBeInTheDocument();
  fireEvent.click(view.getByText("Turn off hard mode"));
  expect(view.getByText("Carnivora")).toBeInTheDocument();
});

test("shared listing game migrates both modes of existing Genera by Family saves", async () => {
  const progress = {
    queue: [],
    retry: [],
    completed: [],
    flawless: [],
    currentFamily: "Muridae",
    found: ["mus"],
    masks: ["", "A_______"],
    currentFlawed: true,
    pass: 2,
    finished: false,
  };
  window.localStorage.setItem(
    "hesperomys.generaByFamily.v2",
    JSON.stringify({
      version: 2,
      hardMode: false,
      normal: progress,
      hard: progress,
    }),
  );
  const view = await mount(<GeneraByFamily />);
  expect(view.getByText("1 / 2")).toBeInTheDocument();
  expect(view.getByText("A_______")).toBeInTheDocument();
  expect(view.getByText("Murini")).toBeInTheDocument();
  const saved = JSON.parse(
    window.localStorage.getItem("hesperomys.generaByFamily.v2")!,
  );
  expect(saved.normal.currentParent).toBe("Muridae");
  expect(saved.normal.currentFlawed).toBe(true);
  expect(saved.hard.currentParent).toBe("Muridae");
  expect(saved.hard.found).toEqual(["mus"]);
});
