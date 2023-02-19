import React from "react";

export default function SearchForm() {
  return (
    <form action="/search" method="get">
      <input name="q" />
      <button type="submit">Search</button>
    </form>
  );
}
