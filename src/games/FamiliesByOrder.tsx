import React, { useMemo } from "react";
import GameScope from "./GameScope";
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

function Game({ rows, storageKey }: { rows: OrderFamilies[]; storageKey: string }) {
  const listRows = useMemo(
    () => rows.map((row) => ({ parent: row.order, children: row.families })),
    [rows],
  );
  return <ListByParent rowsAll={listRows} storageKey={storageKey} labels={labels} />;
}

export default function FamiliesByOrder() {
  return (
    <GameScope file="order_families.json" filter={filterOrderFamilies}>
      {(rows, continent) => (
        <Game rows={rows} storageKey={scopedStorageKey(STORAGE_KEY, continent)} />
      )}
    </GameScope>
  );
}
