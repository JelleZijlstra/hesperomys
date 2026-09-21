export type Geography = {
  version: 1;
  continents: string[];
  genera: Record<string, string[]>;
  families: Record<string, string[]>;
  species: Record<string, Record<string, string[]>>;
  source: { name: string; file: string; sha256: string; generated_at: string };
};

export type GenusFamily = { genus: string; family: string };
export type GenusSpecies = { genus: string; species: string[] };
export type FamilyGenera = { family: string; genera: string[] };
export type OrderFamilies = { order: string; families: string[] };
export type FamilyOrder = { family: string; order: string };
export type FamilyGrouped = {
  family: string;
  groups: {
    name: string | null;
    tribes: { name: string | null; genera: string[] }[];
    unplaced_genera: string[];
  }[];
};

export function scopedStorageKey(key: string, continent: string): string {
  // Keep existing worldwide progress and isolate each regional answer set.
  return continent ? `${key}.continent.${encodeURIComponent(continent)}` : key;
}

export function filterGenusFamily(
  rows: GenusFamily[],
  geo: Geography,
  continent: string,
) {
  return rows.filter((row) => geo.genera[row.genus]?.includes(continent));
}

export function filterFamilyOrder(
  rows: FamilyOrder[],
  geo: Geography,
  continent: string,
) {
  return rows.filter((row) => geo.families[row.family]?.includes(continent));
}

export function filterGenusSpecies(
  rows: GenusSpecies[],
  geo: Geography,
  continent: string,
) {
  return rows
    .map((row) => ({
      ...row,
      species: row.species.filter((name) =>
        geo.species[row.genus]?.[name]?.includes(continent),
      ),
    }))
    .filter((row) => row.species.length > 0);
}

export function filterFamilyGenera(
  rows: FamilyGenera[],
  geo: Geography,
  continent: string,
) {
  return rows
    .map((row) => ({
      ...row,
      genera: row.genera.filter((name) => geo.genera[name]?.includes(continent)),
    }))
    .filter((row) => row.genera.length > 0);
}

export function filterGroupedFamilies(
  grouped: FamilyGrouped[],
  rows: FamilyGenera[],
): Record<string, FamilyGrouped> {
  const result: Record<string, FamilyGrouped> = {};
  for (const row of rows) {
    const family = grouped.find((item) => item.family === row.family);
    if (!family) continue;
    const allowed = new Set(row.genera);
    const groups = family.groups
      .map((group) => ({
        ...group,
        tribes: group.tribes
          .map((tribe) => ({
            ...tribe,
            genera: tribe.genera.filter((name) => allowed.has(name)),
          }))
          .filter((tribe) => tribe.genera.length > 0),
        unplaced_genera: group.unplaced_genera.filter((name) => allowed.has(name)),
      }))
      .filter((group) => group.tribes.length > 0 || group.unplaced_genera.length > 0);
    result[row.family] = { ...family, groups };
  }
  return result;
}

export function filterOrderFamilies(
  rows: OrderFamilies[],
  geo: Geography,
  continent: string,
) {
  return rows
    .map((row) => ({
      ...row,
      families: row.families.filter((name) => geo.families[name]?.includes(continent)),
    }))
    .filter((row) => row.families.length > 0);
}
