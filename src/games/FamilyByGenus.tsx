import React, { useMemo } from "react";
import GameScope from "./GameScope";
import ParentByChild from "./ParentByChild";
import { filterGenusFamily, GenusFamily, scopedStorageKey } from "./geography";

function Game({ rows, continent }: { rows: GenusFamily[]; continent: string }) {
  const data = useMemo(
    () => rows.map((row) => ({ child: row.genus, parent: row.family })),
    [rows],
  );
  return (
    <ParentByChild
      data={data}
      storageKey={scopedStorageKey("hesperomys.familyByGenus.v1", continent)}
      title="Family by Genus"
      promptLabel="Genus"
      answerLabel="Family"
      placeholder="Family (e.g., Muridae)"
    />
  );
}

export default function FamilyByGenus() {
  return (
    <GameScope file="genus_family.json" filter={filterGenusFamily}>
      {(rows, continent) => <Game rows={rows} continent={continent} />}
    </GameScope>
  );
}
