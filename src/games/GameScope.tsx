import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Geography } from "./geography";
import "./FamilyByGenus.css";
import "./GameScope.css";

const CONTINENT_KEY = "hesperomys.games.continent.v1";

export function continentLabel(continent: string): string {
  return continent === "Oceania (Continent)" ? "Oceania" : continent || "Worldwide";
}

function initialContinent(): string {
  try {
    return window.localStorage.getItem(CONTINENT_KEY) || "";
  } catch {
    return "";
  }
}

export function gameDataUrl(file: string): string {
  const base = window.location.port === "3000" ? "http://localhost:8080" : "";
  return `${base}/games/data/${file}`;
}

async function loadJson<T>(file: string): Promise<T> {
  const response = await fetch(gameDataUrl(file));
  if (!response.ok) throw new Error(`Could not load ${file}`);
  return response.json();
}

export default function GameScope<T>({
  file,
  filter,
  children,
}: {
  file: string;
  filter: (rows: T[], geography: Geography, continent: string) => T[];
  children: (rows: T[], continent: string) => React.ReactNode;
}) {
  const [data, setData] = useState<T[] | null>(null);
  const [geography, setGeography] = useState<Geography | null>(null);
  const [continent, setContinent] = useState(initialContinent);
  const [geographyLoaded, setGeographyLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    setData(null);
    setGeographyLoaded(false);
    loadJson<T[]>(file)
      .then((rows) => {
        if (!Array.isArray(rows)) throw new Error("Invalid game data");
        if (!cancelled) setData(rows);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    loadJson<Geography>("geography.json")
      .then((geo) => {
        if (
          geo.version !== 1 ||
          !Array.isArray(geo.continents) ||
          !geo.genera ||
          !geo.families ||
          !geo.species ||
          !geo.source
        ) {
          throw new Error("Invalid geography data");
        }
        if (!cancelled) {
          setGeography(geo);
          setGeographyLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGeography(null);
          setGeographyLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [file, reload]);

  const rows = useMemo(() => {
    if (!data) return null;
    if (!continent) return data;
    return geography ? filter(data, geography, continent) : null;
  }, [data, geography, continent, filter]);

  function selectContinent(value: string) {
    setContinent(value);
    try {
      window.localStorage.setItem(CONTINENT_KEY, value);
    } catch {}
  }

  const unavailable =
    geographyLoaded &&
    continent &&
    (!geography || !geography.continents.includes(continent));
  return (
    <main className="game-scope">
      <section className="game-scope-controls" aria-label="Game geography">
        <Link to="/games">← All games</Link>
        <label htmlFor="game-continent">Continent</label>
        <select
          id="game-continent"
          value={continent}
          onChange={(event) => selectContinent(event.target.value)}
        >
          <option value="">Worldwide</option>
          {continent && !geography?.continents.includes(continent) && (
            <option value={continent}>{continentLabel(continent)}</option>
          )}
          {geography?.continents.map((name) => (
            <option key={name} value={name}>
              {continentLabel(name)}
            </option>
          ))}
        </select>
        {!geography && (
          <p className="game-scope-note" role="status">
            {geographyLoaded
              ? "Continent data unavailable. Worldwide play is still available."
              : "Loading continent options…"}
            {geographyLoaded && (
              <button type="button" onClick={() => setReload((value) => value + 1)}>
                Retry
              </button>
            )}
          </p>
        )}
      </section>
      {error ? (
        <div className="game-scope-message" role="alert">
          Unable to load this game.{" "}
          <button type="button" onClick={() => setReload((value) => value + 1)}>
            Retry
          </button>
        </div>
      ) : unavailable ? (
        <p className="game-scope-message" role="status">
          This continent is unavailable. Choose Worldwide or retry loading continent
          data.
        </p>
      ) : !rows ? (
        <p className="game-scope-message" role="status">
          Loading game…
        </p>
      ) : rows.length === 0 ? (
        <p className="game-scope-message" role="status">
          No taxa are available for this continent. Try another continent or Worldwide.
        </p>
      ) : (
        <React.Fragment key={continent}>{children(rows, continent)}</React.Fragment>
      )}
    </main>
  );
}
