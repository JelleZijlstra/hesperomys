import * as React from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatPublicationDate(date: string, calendar?: string | null): string {
  if (calendar === "french_republican") {
    const match = /^(\d+)(?:-([^-]+)(?:-(\d+))?)?$/.exec(date);
    const label = match
      ? `${match[3] ? `${match[3]} ` : ""}${match[2] ? `${match[2]}, ` : ""}year ${
          match[1]
        }`
      : date;
    return `${label} (French Republican calendar)`;
  }
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(date);
  let label = date;
  if (match) {
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) {
      label = `${match[3] ? `${Number(match[3])} ` : ""}${MONTHS[month - 1]} ${
        match[1]
      }`;
    }
  }
  return calendar === "julian" ? `${label} (Julian calendar)` : label;
}

function PublicationDate({
  date,
  calendar,
}: {
  date: string;
  calendar?: string | null;
}) {
  return <>{formatPublicationDate(date, calendar)}</>;
}

export default PublicationDate;
