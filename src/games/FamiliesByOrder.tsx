import React, { useMemo } from "react";
import GameScope, { continentLabel } from "./GameScope";
import ListByParent from "./ListByParent";
import { OrderFamilies, filterOrderFamilies, scopedStorageKey } from "./geography";

const STORAGE_KEY = "hesperomys.familiesByOrder.v1";
const labels = {
  title: "Families by Order",
  parent: "Order",
  parents: "orders",
  child: "Family",
  children: "families",
  placeholder: "Enter family (e.g., Muridae)",
};

function Game({ rows, continent }: { rows: OrderFamilies[]; continent: string }) {
  const listRows = useMemo(
    () => rows.map((row) => ({ parent: row.order, children: row.families })),
    [rows],
  );
  return (
    <ListByParent
      rowsAll={listRows}
      storageKey={scopedStorageKey(STORAGE_KEY, continent)}
      labels={{ ...labels, title: `${labels.title}: ${continentLabel(continent)}` }}
    />
  );
}

export default function FamiliesByOrder() {
  return (
    <GameScope file="order_families.json" filter={filterOrderFamilies}>
      {(rows, continent) => <Game rows={rows} continent={continent} />}
    </GameScope>
  );
}
