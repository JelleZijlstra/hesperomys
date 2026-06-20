import React, { useEffect, useMemo, useState } from "react";
import "./GeneraByFamily.css";

type FamilyRow = { family: string; genera: string[] };
type TribeGroup = { name: string | null; genera: string[] };
type SubfamilyGroup = {
  name: string | null;
  tribes: TribeGroup[];
  unplaced_genera: string[];
};
type FamilyGrouped = { family: string; groups: SubfamilyGroup[] };
type ModeKey = "normal" | "hard";
type Progress = {
  queue: string[];
  retry: string[];
  completed: string[];
  flawless: string[];
  currentFamily: string | null;
  found: string[];
  masks: string[];
  currentFlawed: boolean;
  pass: number;
  finished: boolean;
};
type StoredState = {
  version: 2;
  hardMode: boolean;
  normal?: Progress;
  hard?: Progress;
};

const STORAGE_KEY = "hesperomys.generaByFamily.v2";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function getModeKey(hardMode: boolean): ModeKey {
  return hardMode ? "hard" : "normal";
}

function readStoredState(): StoredState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 2) return parsed as StoredState;
  } catch {
    return null;
  }
  return null;
}

function initialHardMode(): boolean {
  return readStoredState()?.hardMode ?? false;
}

function writeStoredState(next: StoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Losing saved game state is better than blocking play.
  }
}

function uniqueValid(values: string[], valid: Set<string>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (valid.has(value) && !seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }
  return out;
}

function addUnique(values: string[], value: string): string[] {
  return values.includes(value) ? values : [...values, value];
}

function removeValue(values: string[], value: string): string[] {
  return values.filter((item) => item !== value);
}

function emptyMasks(row: FamilyRow): string[] {
  return row.genera.map(() => "");
}

function makeRowMap(rows: FamilyRow[]): Map<string, FamilyRow> {
  const map = new Map<string, FamilyRow>();
  for (const row of rows) map.set(row.family, row);
  return map;
}

function freshProgress(rows: FamilyRow[]): Progress {
  return {
    queue: shuffle(rows.map((row) => row.family)),
    retry: [],
    completed: [],
    flawless: [],
    currentFamily: null,
    found: [],
    masks: [],
    currentFlawed: false,
    pass: 1,
    finished: false,
  };
}

function advanceToNextFamily(progress: Progress, rows: FamilyRow[]): Progress {
  const rowByFamily = makeRowMap(rows);
  const validFamilies = new Set(rowByFamily.keys());
  const flawless = uniqueValid(progress.flawless, validFamilies);
  const flawlessSet = new Set(flawless);
  const remainingFamilies = rows
    .map((row) => row.family)
    .filter((family) => !flawlessSet.has(family));

  if (remainingFamilies.length === 0) {
    return {
      ...progress,
      queue: [],
      retry: [],
      flawless,
      currentFamily: null,
      found: [],
      masks: [],
      currentFlawed: false,
      finished: true,
    };
  }

  let queue = uniqueValid(progress.queue, validFamilies).filter(
    (family) => !flawlessSet.has(family),
  );
  let retry = uniqueValid(progress.retry, validFamilies).filter(
    (family) => !flawlessSet.has(family),
  );
  let pass = progress.pass;

  if (queue.length === 0) {
    if (retry.length > 0) {
      queue = shuffle(retry);
      retry = [];
      pass += 1;
    } else {
      queue = shuffle(remainingFamilies);
      pass += 1;
    }
  }

  const [currentFamily, ...rest] = queue;
  const row = rowByFamily.get(currentFamily);
  if (!row) return advanceToNextFamily({ ...progress, queue: rest }, rows);
  return {
    ...progress,
    queue: rest,
    retry,
    flawless,
    currentFamily,
    found: [],
    masks: emptyMasks(row),
    currentFlawed: false,
    pass,
    finished: false,
  };
}

function sanitizeProgress(saved: Progress | undefined, rows: FamilyRow[]): Progress {
  const validFamilies = new Set(rows.map((row) => row.family));
  if (!saved) return advanceToNextFamily(freshProgress(rows), rows);

  const rowByFamily = makeRowMap(rows);
  const currentRow =
    saved.currentFamily && validFamilies.has(saved.currentFamily)
      ? rowByFamily.get(saved.currentFamily)
      : null;
  const found = currentRow
    ? uniqueValid(
        saved.found,
        new Set(currentRow.genera.map((genus) => genus.toLowerCase())),
      )
    : [];
  const masks = currentRow ? currentRow.genera.map((_, i) => saved.masks[i] ?? "") : [];
  const progress: Progress = {
    queue: uniqueValid(saved.queue, validFamilies),
    retry: uniqueValid(saved.retry, validFamilies),
    completed: uniqueValid(saved.completed, validFamilies),
    flawless: uniqueValid(saved.flawless, validFamilies),
    currentFamily: currentRow ? currentRow.family : null,
    found,
    masks,
    currentFlawed: saved.currentFlawed,
    pass: Math.max(saved.pass || 1, 1),
    finished: saved.finished,
  };
  if (progress.currentFamily) return progress;
  if (progress.finished && progress.flawless.length === rows.length) return progress;
  return advanceToNextFamily(progress, rows);
}

export default function GeneraByFamily() {
  const [rowsAll, setRowsAll] = useState<FamilyRow[] | null>(null);
  const [hardMode, setHardMode] = useState(initialHardMode);
  const rows = useMemo(() => {
    if (!rowsAll) return null;
    const filtered = hardMode ? rowsAll.filter((r) => r.genera.length > 10) : rowsAll;
    return filtered.length ? filtered : rowsAll;
  }, [rowsAll, hardMode]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [progressMode, setProgressMode] = useState<ModeKey>(() =>
    getModeKey(initialHardMode()),
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<React.ReactNode | null>(null);
  const [feed, setFeed] = useState<React.ReactNode[]>([]);
  const [grouped, setGrouped] = useState<Record<string, FamilyGrouped> | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const dev = window.location.port === "3000";
    const url = dev
      ? "http://localhost:8080/games/data/family_genera.json"
      : "/games/data/family_genera.json";
    fetch(url)
      .then((r) => r.json())
      .then((data: FamilyRow[]) => setRowsAll(data))
      .catch((e) => console.error("Failed to load game data", e));
    const url2 = dev
      ? "http://localhost:8080/games/data/family_genera_grouped.json"
      : "/games/data/family_genera_grouped.json";
    fetch(url2)
      .then((r) => r.json())
      .then((rows: FamilyGrouped[]) => {
        const map: Record<string, FamilyGrouped> = {};
        for (const row of rows) map[row.family] = row;
        setGrouped(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!rows) return;
    const stored = readStoredState();
    const modeKey = getModeKey(hardMode);
    setProgressMode(modeKey);
    setProgress(sanitizeProgress(stored?.[modeKey], rows));
    setAnswer("");
    setFeedback(null);
    setFeed([]);
  }, [hardMode, rows]);

  useEffect(() => {
    if (!progress) return;
    const modeKey = getModeKey(hardMode);
    if (progressMode !== modeKey) return;
    const stored = readStoredState() ?? { version: 2, hardMode, normal: undefined };
    writeStoredState({
      ...stored,
      version: 2,
      hardMode,
      [modeKey]: progress,
    });
  }, [hardMode, progress, progressMode]);

  const rowByFamily = useMemo(() => {
    return makeRowMap(rows ?? []);
  }, [rows]);
  const familyRow = progress?.currentFamily
    ? (rowByFamily.get(progress.currentFamily) ?? null)
    : null;
  const found = useMemo(() => new Set(progress?.found ?? []), [progress]);
  const masks = progress?.masks ?? [];
  const totalFamilies = rows?.length ?? 0;
  const completedFamilies = progress?.completed.length ?? 0;
  const flawlessFamilies = progress?.flawless.length ?? 0;
  const remainingThisPass =
    (progress?.queue.length ?? 0) + (progress?.currentFamily ? 1 : 0);
  const retryFamilies = progress?.retry.length ?? 0;
  const total = familyRow?.genera.length ?? 0;
  const foundCount = found.size;
  const missing = useMemo(() => {
    if (!familyRow) return [] as string[];
    return familyRow.genera.filter((g) => !found.has(g.toLowerCase()));
  }, [familyRow, found]);

  function resetCurrentMode() {
    if (!rows) return;
    const next = advanceToNextFamily(freshProgress(rows), rows);
    const stored = readStoredState() ?? { version: 2, hardMode };
    const modeKey = getModeKey(hardMode);
    writeStoredState({
      ...stored,
      version: 2,
      hardMode,
      [modeKey]: next,
    });
    setProgress(next);
    setAnswer("");
    setFeedback(null);
    setFeed([]);
  }

  function revealHint() {
    if (!familyRow || !progress) return;
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
    const updated = progress.masks.slice();
    updated[i] = next.join("");
    setProgress({
      ...progress,
      masks: updated,
      currentFlawed: true,
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!familyRow || !progress) return;
    const ans = normalize(answer);
    if (!ans) return;
    const idx = familyRow.genera.findIndex((g) => normalize(g) === ans);
    if (idx >= 0) {
      if (!found.has(ans)) {
        setProgress({
          ...progress,
          found: addUnique(progress.found, ans),
        });
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
      setProgress({
        ...progress,
        currentFlawed: true,
      });
    }
    setAnswer("");
  }

  function skipFamily() {
    if (!rows || !familyRow || !progress) return;
    const nextProgress = advanceToNextFamily(
      {
        ...progress,
        retry: addUnique(progress.retry, familyRow.family),
        currentFamily: null,
        found: [],
        masks: [],
        currentFlawed: false,
      },
      rows,
    );
    const msg = <>Skipped {familyRow.family}; it will return in the next pass.</>;
    setFeedback(null);
    setFeed((prev) => [msg, ...prev].slice(0, 10));
    setAnswer("");
    setProgress(nextProgress);
  }

  useEffect(() => {
    if (
      rows &&
      familyRow &&
      progress &&
      progress.found.length === familyRow.genera.length &&
      familyRow.genera.length > 0
    ) {
      const clean = !progress.currentFlawed;
      const msg = (
        <>
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          Completed {familyRow.family}! ({progress.found.length}/
          {familyRow.genera.length}
          {clean ? ", flawless" : ", retry later"})
        </>
      );
      setFeedback(<>{msg} Loading next family…</>);
      setFeed((prev) => [msg, ...prev].slice(0, 10));
      // Brief pause to show completion, then move on
      const t = setTimeout(() => {
        setProgress((current) => {
          if (!current || current.currentFamily !== familyRow.family) return current;
          const completed = addUnique(current.completed, familyRow.family);
          const flawless = clean
            ? addUnique(current.flawless, familyRow.family)
            : current.flawless;
          const retry = clean
            ? removeValue(current.retry, familyRow.family)
            : addUnique(current.retry, familyRow.family);
          return advanceToNextFamily(
            {
              ...current,
              completed,
              flawless,
              retry,
              currentFamily: null,
              found: [],
              masks: [],
              currentFlawed: false,
            },
            rows,
          );
        });
        setAnswer("");
        setFeedback(null);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [progress, familyRow, rows]);

  useEffect(() => {
    if (progress?.finished) {
      setFeedback(
        <>
          All {totalFamilies} families have been completed flawlessly. Open progress to
          start over.
        </>,
      );
    }
  }, [progress?.finished, totalFamilies]);

  function renderSettingsModal() {
    if (!isSettingsOpen) return null;
    return (
      <div className="game-modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
        <div
          className="game-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="genera-progress-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="game-modal-header">
            <h3 id="genera-progress-title">Progress</h3>
            <button
              className="btn icon-btn"
              type="button"
              aria-label="Close progress"
              onClick={() => setIsSettingsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="progress-grid">
            <div className="progress-stat">
              <div className="progress-label">Finished</div>
              <div className="progress-value">
                {completedFamilies} / {totalFamilies}
              </div>
            </div>
            <div className="progress-stat">
              <div className="progress-label">Flawless</div>
              <div className="progress-value">
                {flawlessFamilies} / {totalFamilies}
              </div>
            </div>
            <div className="progress-stat">
              <div className="progress-label">Pass</div>
              <div className="progress-value">{progress?.pass ?? 1}</div>
            </div>
            <div className="progress-stat">
              <div className="progress-label">This pass</div>
              <div className="progress-value">{remainingThisPass} left</div>
            </div>
            <div className="progress-stat">
              <div className="progress-label">Retry next</div>
              <div className="progress-value">{retryFamilies}</div>
            </div>
          </div>
          <label className="game-toggle modal-toggle">
            <input
              type="checkbox"
              checked={hardMode}
              onChange={(e) => setHardMode(e.target.checked)}
            />
            Hard mode (only families with more than 10 genera)
          </label>
          <div className="modal-actions">
            <button className="btn danger" type="button" onClick={resetCurrentMode}>
              Clear progress
            </button>
            <button
              className="btn primary"
              type="button"
              onClick={() => setIsSettingsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-root">
      <div className="game-card">
        <div className="game-header">
          <h2 className="game-title">Genera by Family</h2>
          <div className="header-actions">
            <div className="score-pill" title="Found / Total">
              {foundCount} / {total}
            </div>
            <button
              className="btn compact"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
            >
              Progress
            </button>
          </div>
        </div>
        <p className="game-subtitle">Name all genera in the given mammal family.</p>

        {!familyRow ? (
          progress?.finished ? (
            <div className="completion-panel">
              All {totalFamilies} families have been completed flawlessly.
            </div>
          ) : (
            <p className="loading">Loading…</p>
          )
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
                <button className="btn" type="button" onClick={skipFamily}>
                  Skip
                </button>
              </div>
            </form>

            {/* Subfamily / tribe structure (names revealed on completion). Hide if no structure. */}
            {grouped &&
              grouped[familyRow.family] &&
              grouped[familyRow.family].groups.some(
                (g) => (g.name && g.name.length > 0) || g.tribes.length > 0,
              ) && (
                <div className="taxon-viewport">
                  <div className="taxon-structure">
                    {grouped[familyRow.family].groups.map((sg, sidx) => {
                      const subGenera = new Set<string>(
                        [
                          ...sg.unplaced_genera,
                          ...sg.tribes.flatMap((t) => t.genera),
                        ].map((g) => g.toLowerCase()),
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
                                          className={
                                            "genera-chip" + (f ? " found" : " missing")
                                          }
                                        >
                                          {f ? (
                                            <em>{g}</em>
                                          ) : masks[i] ? (
                                            masks[i]
                                          ) : (
                                            "___"
                                          )}
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
                                        className={
                                          "genera-chip" + (f ? " found" : " missing")
                                        }
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
              )}

            {/* If no subfamily/tribe structure, show flat genera board */}
            {!(
              grouped &&
              grouped[familyRow.family] &&
              grouped[familyRow.family].groups.some(
                (g) => (g.name && g.name.length > 0) || g.tribes.length > 0,
              )
            ) && (
              <div className="taxon-viewport">
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
              </div>
            )}

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
      {renderSettingsModal()}
    </div>
  );
}
