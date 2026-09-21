import { formatPublicationDate } from "./PublicationDate";

test.each([
  ["1900", undefined, "1900"],
  ["1900-02", "gregorian", "February 1900"],
  ["1900-02-29", "julian", "29 February 1900 (Julian calendar)"],
  ["1900-02", "julian", "February 1900 (Julian calendar)"],
  [
    "12-Brumaire-1",
    "french_republican",
    "1 Brumaire, year 12 (French Republican calendar)",
  ],
  [
    "12-Brumaire",
    "french_republican",
    "Brumaire, year 12 (French Republican calendar)",
  ],
  ["12", "french_republican", "year 12 (French Republican calendar)"],
  ["undated", null, "undated"],
  ["1900-13", null, "1900-13"],
])("preserves source precision for %s in %s", (date, calendar, expected) => {
  expect(formatPublicationDate(date as string, calendar)).toBe(expected);
});
