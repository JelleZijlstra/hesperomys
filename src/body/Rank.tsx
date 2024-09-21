import React from "react";

const RANK_TO_STRING = new Map([
  ["class_", "class"],
  ["species_group", "species group"],
  ["other_subgeneric", "other subgeneric rank"],
  ["other_family", "other family-group rank"],
  ["unranked_family", "unranked family-group taxon"],
  ["other_species", "other species-group rank"],
  ["informal_species", "informal species-group rank"],
  ["synonym_species", "synonym"],
  ["synonym_genus", "synonym"],
  ["synonym_family", "synonym"],
  ["synonym_high", "synonym"],
]);

export function Rank({ rank }: { rank: string }) {
  return <>{RANK_TO_STRING.get(rank) || rank}</>;
}
