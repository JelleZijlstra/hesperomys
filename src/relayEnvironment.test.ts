import { fetchQuery } from "./relayEnvironment";

const originalFetch = window.fetch;
const mockFetch = jest.fn();

beforeEach(() => {
  mockFetch.mockReset();
  window.fetch = mockFetch;
});

afterEach(() => {
  window.fetch = originalFetch;
});

test("rejects GraphQL errors even when the response contains null model data", async () => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      data: { models: [null] },
      errors: [
        { message: "Int cannot represent non 32-bit signed integer value: 5482962866" },
      ],
    }),
  });
  await expect(fetchQuery({ text: "query { models }" }, {})).rejects.toThrow(
    "5482962866",
  );
});

test("preserves a successful empty lookup for the not-found page", async () => {
  const response = { data: { models: [] } };
  mockFetch.mockResolvedValue({ ok: true, json: async () => response });
  await expect(fetchQuery({ text: "query { models }" }, {})).resolves.toEqual(response);
});

test("rejects unsuccessful HTTP responses", async () => {
  mockFetch.mockResolvedValue({ ok: false, status: 503 });
  await expect(fetchQuery({ text: "query { models }" }, {})).rejects.toThrow(
    "HTTP 503",
  );
});
