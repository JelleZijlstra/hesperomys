import React, { useEffect, useMemo, useState } from "react";
import "./GeneraByFamily.css";

type FamilyRow = { family: string; genera: string[] };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDifferent<T>(arr: T[], exclude?: (item: T) => boolean): T {
  if (!arr.length) throw new Error("empty array");
  if (!exclude) return pick(arr);
  if (arr.length === 1) return arr[0];
  let candidate: T = pick(arr);
  let attempts = 0;
  while (exclude(candidate) && attempts < 25) {
    candidate = pick(arr);
    attempts += 1;
  }
  return candidate;
}

export default function GeneraByFamily() {
  const [rowsAll, setRowsAll] = useState<FamilyRow[] | null>(null);
  const [hardMode, setHardMode] = useState(false);
  const rows = useMemo(() => {
    if (!rowsAll) return null;
    const filtered = hardMode ? rowsAll.filter((r) => r.genera.length > 10) : rowsAll;
    return filtered.length ? filtered : rowsAll;
  }, [rowsAll, hardMode]);
  const [familyRow, setFamilyRow] = useState<FamilyRow | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [masks, setMasks] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  // No terminal done state; automatically advance to next family
  const [feedback, setFeedback] = useState<React.ReactNode | null>(null);
  const [feed, setFeed] = useState<React.ReactNode[]>([]);
  const [seenFamilies, setSeenFamilies] = useState<Set<string>>(new Set());

  useEffect(() => {
    const dev = window.location.port === "3000";
    const url = dev
      ? "http://localhost:8080/games/data/family_genera.json"
      : "/games/data/family_genera.json";
    fetch(url)
      .then((r) => r.json())
      .then((data: FamilyRow[]) => setRowsAll(data))
      .catch((e) => console.error("Failed to load game data", e));
  }, []);

  useEffect(() => {
    if (rows && !familyRow) {
      const candidates = rows.filter((r) => !seenFamilies.has(r.family));
      const next = candidates.length ? pick(candidates) : pick(rows);
      startFamily(next);
    }
  }, [rows]);

  // When toggling hard mode, reset session and start fresh
  useEffect(() => {
    if (!rows) return;
    setSeenFamilies(new Set());
    startFamily(pick(rows));
    setFeed([]);
  }, [hardMode]);

  const total = familyRow?.genera.length ?? 0;
  const foundCount = found.size;
  const missing = useMemo(() => {
    if (!familyRow) return [] as string[];
    return familyRow.genera.filter((g) => !found.has(g.toLowerCase()));
  }, [familyRow, found]);

  function normalize(s: string) {
    return s.trim().toLowerCase();
  }

  function startFamily(row: FamilyRow) {
    setFamilyRow(row);
    setFound(new Set());
    setAnswer("");
    setFeedback(null);
    setMasks(row.genera.map(() => ""));
  }

  function revealHint() {
    if (!familyRow) return;
    const missIdxs = familyRow.genera
      .map((g, i) => ({ g, i }))
      .filter(({ g }) => !found.has(g.toLowerCase()));
    if (!missIdxs.length) return;
    const { g, i } = pick(missIdxs);
    const current = masks[i] || "";
    const target = g;
    // Initialize mask with underscores for letters
    let next = current.split("");
    if (next.length === 0)
      next = Array.from(target).map((ch) => (/[A-Za-z]/.test(ch) ? "_" : ch));
    // Reveal next unrevealed letter
    for (let idx = 0; idx < target.length; idx++) {
      if (/[A-Za-z]/.test(target[idx]) && next[idx] === "_") {
        next[idx] = target[idx];
        break;
      }
    }
    const updated = masks.slice();
    updated[i] = next.join("");
    setMasks(updated);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!familyRow) return;
    const ans = normalize(answer);
    if (!ans) return;
    const idx = familyRow.genera.findIndex((g) => normalize(g) === ans);
    if (idx >= 0) {
      if (!found.has(ans)) {
        const nf = new Set(found);
        nf.add(ans);
        setFound(nf);
        setFeedback(
          <>
            <span role="img" aria-label="correct">
              ✅
            </span>{" "}
            <em>{familyRow.genera[idx]}</em> added
          </>,
        );
      } else {
        setFeedback(
          <>
            <span role="img" aria-label="info">
              ℹ️
            </span>{" "}
            You already entered <em>{familyRow.genera[idx]}</em>
          </>,
        );
      }
    } else {
      setFeedback(
        <>
          <span role="img" aria-label="incorrect">
            ❌
          </span>{" "}
          No match for <em>{answer}</em>
        </>,
      );
    }
    setAnswer("");
  }

  useEffect(() => {
    if (
      rows &&
      familyRow &&
      found.size === familyRow.genera.length &&
      familyRow.genera.length > 0
    ) {
      const msg = (
        <>
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          Completed {familyRow.family}! ({found.size}/{familyRow.genera.length})
        </>
      );
      setFeedback(<>{msg} Loading next family…</>);
      setFeed((prev) => [msg, ...prev].slice(0, 10));
      // Brief pause to show completion, then move on
      const t = setTimeout(() => {
        // Mark this family as seen only upon completion
        setSeenFamilies((prev) => {
          const ns = new Set(prev);
          ns.add(familyRow.family);
          return ns;
        });
        // Prefer families not yet seen this session (and not the one just completed)
        const unseen = rows.filter(
          (r) => r.family !== familyRow.family && !seenFamilies.has(r.family),
        );
        if (unseen.length === 0) {
          // All seen: reset session tracking and pick any family at random
          setSeenFamilies(new Set());
          startFamily(pick(rows));
        } else {
          startFamily(pick(unseen));
        }
      }, 800);
      return () => clearTimeout(t);
    }
  }, [found, familyRow, rows, seenFamilies]);

  return (
    <div className="game-root">
      <div className="game-card">
        <div className="game-header">
          <h2 className="game-title">Genera by Family</h2>
          <div className="score-pill" title="Found / Total">
            {foundCount} / {total}
          </div>
        </div>
        <p className="game-subtitle">Name all genera in the given mammal family.</p>
        <label className="game-toggle">
          <input
            type="checkbox"
            checked={hardMode}
            onChange={(e) => setHardMode(e.target.checked)}
          />
          Hard mode (only families with more than 10 genera)
        </label>

        {!familyRow ? (
          <p className="loading">Loading…</p>
        ) : (
          <>
            <div className="prompt">
              <div className="prompt-label">Family</div>
              <div className="prompt-genus">{familyRow.family}</div>
            </div>
            <form className="controls" onSubmit={submit}>
              <input
                className="answer-input"
                type="text"
                placeholder="Enter genus (e.g., Mus)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
              />
              <div className="buttons">
                <button className="btn primary" type="submit">
                  Submit
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={revealHint}
                  disabled={missing.length === 0}
                >
                  Hint
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    if (!rows) return;
                    const unseen = rows.filter((r) => !seenFamilies.has(r.family));
                    const next = unseen.length ? pick(unseen) : pick(rows);
                    startFamily(next);
                  }}
                >
                  New Family
                </button>
              </div>
            </form>

            <div className="genera-board">
              {familyRow.genera.map((g, i) => {
                const foundIt = found.has(g.toLowerCase());
                return (
                  <div
                    key={g}
                    className={"genera-chip" + (foundIt ? " found" : " missing")}
                  >
                    {foundIt ? <em>{g}</em> : masks[i] ? masks[i] : "___"}
                  </div>
                );
              })}
            </div>

            {feedback && (
              <div className="feedback" aria-live="polite">
                {feedback}
              </div>
            )}

            {feed.length > 0 && (
              <div className="feedback-stream" aria-live="polite">
                {feed.map((node, i) => (
                  <div key={i} className="feedback">
                    {node}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
