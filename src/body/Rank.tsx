import React from "react";

const RANK_TO_STRING = new Map([
  ["class_", "class"],
  ["species_group", "species group"],
]);

export function Rank({ rank }: { rank: string }) {
  return <>{RANK_TO_STRING.get(rank) || rank}</>;
}
