import React, { useEffect, useMemo, useState } from "react";
import GameScope, { continentLabel, gameDataUrl } from "./GameScope";
import ListByParent from "./ListByParent";
import {
  FamilyGenera,
  FamilyGrouped,
  filterFamilyGenera,
  filterGroupedFamilies,
  scopedStorageKey,
} from "./geography";

const STORAGE_KEY = "hesperomys.generaByFamily.v2";
const labels = {
  title: "Genera by Family",
  parent: "Family",
  parents: "families",
  child: "Genus",
  children: "genera",
  placeholder: "Enter genus (e.g., Mus)",
  italicAnswers: true,
};

function renderGroupedBoard(
  familyRow: FamilyGenera,
  grouped: Record<string, FamilyGrouped>,
  found: Set<string>,
  masks: string[],
) {
  if (
    !(
      grouped[familyRow.family] &&
      grouped[familyRow.family].groups.some(
        (g) => (g.name && g.name.length > 0) || g.tribes.length > 0,
      )
    )
  )
    return null;
  return (
    <div className="taxon-viewport">
      <div className="taxon-structure">
        {grouped[familyRow.family].groups.map((sg, sidx) => {
          const subGenera = new Set<string>(
            [...sg.unplaced_genera, ...sg.tribes.flatMap((t) => t.genera)].map((g) =>
              g.toLowerCase(),
            ),
          );
          const subFound = Array.from(subGenera).every((g) => found.has(g));
          return (
            <div key={sidx} className="subfamily-box">
              <div className="subfamily-header">
                {subFound && sg.name ? sg.name : ""}
              </div>
              <div className="tribe-grid">
                {sg.tribes.map((tg, tidx) => {
                  const tribeAll = tg.genera.map((g) => g.toLowerCase());
                  const tribeFound = tribeAll.every((g) => found.has(g));
                  return (
                    <div key={tidx} className="tribe-box">
                      <div className="tribe-header">
                        {tribeFound && tg.name ? tg.name : ""}
                      </div>
                      <div className="genera-row">
                        {tg.genera.map((g) => {
                          const f = found.has(g.toLowerCase());
                          const i = familyRow.genera.indexOf(g);
                          return (
                            <div
                              key={g}
                              className={"genera-chip" + (f ? " found" : " missing")}
                            >
                              {f ? <em>{g}</em> : masks[i] ? masks[i] : "___"}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {sg.unplaced_genera.length > 0 && (
                  <div className="tribe-box">
                    <div className="genera-row">
                      {sg.unplaced_genera.map((g) => {
                        const f = found.has(g.toLowerCase());
                        const i = familyRow.genera.indexOf(g);
                        return (
                          <div
                            key={g}
                            className={"genera-chip" + (f ? " found" : " missing")}
                          >
                            {f ? <em>{g}</em> : masks[i] ? masks[i] : "___"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Game({ rows, continent }: { rows: FamilyGenera[]; continent: string }) {
  const [groupedAll, setGroupedAll] = useState<FamilyGrouped[]>([]);
  const grouped = useMemo(
    () => filterGroupedFamilies(groupedAll, rows),
    [groupedAll, rows],
  );
  const listRows = useMemo(
    () => rows.map((row) => ({ parent: row.family, children: row.genera })),
    [rows],
  );
  useEffect(() => {
    let cancelled = false;
    fetch(gameDataUrl("family_genera_grouped.json"))
      .then((response) => {
        if (!response.ok) throw new Error("Missing grouping data");
        return response.json();
      })
      .then((groups: FamilyGrouped[]) => {
        if (!cancelled) setGroupedAll(groups);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <ListByParent
      rowsAll={listRows}
      storageKey={scopedStorageKey(STORAGE_KEY, continent)}
      labels={{ ...labels, title: `${labels.title}: ${continentLabel(continent)}` }}
      renderBoard={(row, found, masks) =>
        renderGroupedBoard(
          { family: row.parent, genera: row.children },
          grouped,
          found,
          masks,
        )
      }
    />
  );
}

export default function GeneraByFamily() {
  return (
    <GameScope file="family_genera.json" filter={filterFamilyGenera}>
      {(rows, continent) => <Game rows={rows} continent={continent} />}
    </GameScope>
  );
}
