import React from "react";

export const RANK_TO_GROUP = new Map([
  ["variety", "species"],
  ["infrasubspecific", "species"],
  ["subspecies", "species"],
  ["species", "species"],
  ["species_group", "species"],
  ["subgenus", "genus"],
  ["other_subgeneric", "genus"],
  ["genus", "genus"],
  ["division", "high"],
  ["infratribe", "family"],
  ["subtribe", "family"],
  ["tribe", "family"],
  ["subfamily", "family"],
  ["family", "family"],
  ["superfamily", "family"],
  ["hyperfamily", "family"],
  ["other_family", "family"],
  ["unranked_family", "family"],
  ["parvorder", "high"],
  ["infraorder", "high"],
  ["suborder", "high"],
  ["semiorder", "high"],
  ["order", "high"],
  ["superorder", "high"],
  ["magnorder", "high"],
  ["subcohort", "high"],
  ["cohort", "high"],
  ["supercohort", "high"],
  ["infraclass", "high"],
  ["subclass", "high"],
  ["class_", "high"],
  ["superclass", "high"],
  ["infraphylum", "high"],
  ["subphylum", "high"],
  ["phylum", "high"],
  ["superphylum", "high"],
  ["infrakingdom", "high"],
  ["subkingdom", "high"],
  ["kingdom", "high"],
  ["superkingdom", "high"],
  ["domain", "high"],
  ["root", "high"],
  ["unranked", "high"],
  ["informal", "high"],
  ["aberratio", "species"],
  ["morph", "species"],
  ["natio", "species"],
  ["subvariety", "species"],
  ["other_species", "species"],
  ["informal_species", "species"],
  ["mutation", "species"],
  ["race", "species"],
  ["synonym_species", "species"],
  ["synonym_genus", "genus"],
  ["synonym_family", "family"],
  ["synonym_high", "high"],
]);
export default function MaybeItalicize({
  group,
  name,
}: {
  group: string;
  name: string | null;
}) {
  if (name === null) {
    return null;
  } else if (group === "species" || group === "genus") {
    return <i>{name}</i>;
  } else {
    return <>{name}</>;
  }
}
