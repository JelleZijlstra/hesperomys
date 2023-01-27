import * as React from "react";

function PublicationDate({ date }: { date: string }) {
  const match =
    /^(\d{4})-(\d{2})$/.exec(date) || /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (match) {
    const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long" });
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const dateObj = new Date(year, month - 1);
    const monthName = monthFormat.format(dateObj);
    return (
      <>
        {match[3] && `${parseInt(match[3], 10)} `}
        {monthName} {year}
      </>
    );
  }
  return <>{date}</>;
}

export default PublicationDate;
