import React, { useMemo } from "react";
import GameScope, { continentLabel } from "./GameScope";
import ParentByChild from "./ParentByChild";
import { FamilyOrder, filterFamilyOrder, scopedStorageKey } from "./geography";

function Game({ rows, continent }: { rows: FamilyOrder[]; continent: string }) {
  const data = useMemo(
    () => rows.map((row) => ({ child: row.family, parent: row.order })),
    [rows],
  );
  return (
    <ParentByChild
      data={data}
      storageKey={scopedStorageKey("hesperomys.orderByFamily.v1", continent)}
      title={`Order by Family: ${continentLabel(continent)}`}
      promptLabel="Family"
      answerLabel="Order"
      placeholder="Order (e.g., Rodentia)"
    />
  );
}

export default function OrderByFamily() {
  return (
    <GameScope file="family_order.json" filter={filterFamilyOrder}>
      {(rows, continent) => <Game rows={rows} continent={continent} />}
    </GameScope>
  );
}
