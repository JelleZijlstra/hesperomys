import React, { useEffect, useMemo, useState } from "react";
import "./FamilyByGenus.css";

type Row = { genus: string; family: string };
type Progress = {
  queue: string[];
  retry: string[];
  completed: string[];
  flawless: string[];
  currentGenus: string | null;
  pass: number;
  finished: boolean;
  correct: number;
  attempts: number;
};
type StoredState = {
  version: 1;
  progress: Progress;
};

const STORAGE_KEY = "hesperomys.familyByGenus.v1";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

function readStoredProgress(): Progress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed?.version === 1) return parsed.progress;
  } catch {
    return null;
  }
  return null;
}

function writeStoredProgress(progress: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, progress }));
  } catch {
    // Losing saved game state is better than blocking play.
  }
}

function makeRowMap(rows: Row[]): Map<string, Row> {
  const map = new Map<string, Row>();
  for (const row of rows) map.set(row.genus, row);
  return map;
}

function freshProgress(rows: Row[]): Progress {
  return {
    queue: shuffle(rows.map((row) => row.genus)),
    retry: [],
    completed: [],
    flawless: [],
    currentGenus: null,
    pass: 1,
    finished: false,
    correct: 0,
    attempts: 0,
  };
}

function advanceToNextPrompt(progress: Progress, rows: Row[]): Progress {
  const rowByGenus = makeRowMap(rows);
  const validGenera = new Set(rowByGenus.keys());
  const flawless = uniqueValid(progress.flawless, validGenera);
  const flawlessSet = new Set(flawless);
  const remainingGenera = rows
    .map((row) => row.genus)
    .filter((genus) => !flawlessSet.has(genus));

  if (remainingGenera.length === 0) {
    return {
      ...progress,
      queue: [],
      retry: [],
      flawless,
      currentGenus: null,
      finished: true,
    };
  }

  let queue = uniqueValid(progress.queue, validGenera).filter(
    (genus) => !flawlessSet.has(genus),
  );
  let retry = uniqueValid(progress.retry, validGenera).filter(
    (genus) => !flawlessSet.has(genus),
  );
  let pass = progress.pass;

  if (queue.length === 0) {
    if (retry.length > 0) {
      queue = shuffle(retry);
      retry = [];
      pass += 1;
    } else {
      queue = shuffle(remainingGenera);
      pass += 1;
    }
  }

  const [currentGenus, ...rest] = queue;
  if (!rowByGenus.has(currentGenus)) {
    return advanceToNextPrompt({ ...progress, queue: rest }, rows);
  }
  return {
    ...progress,
    queue: rest,
    retry,
    flawless,
    currentGenus,
    pass,
    finished: false,
  };
}

function sanitizeProgress(saved: Progress | null, rows: Row[]): Progress {
  const validGenera = new Set(rows.map((row) => row.genus));
  if (!saved) return advanceToNextPrompt(freshProgress(rows), rows);

  const currentGenus =
    saved.currentGenus && validGenera.has(saved.currentGenus)
      ? saved.currentGenus
      : null;
  const progress: Progress = {
    queue: uniqueValid(saved.queue, validGenera),
    retry: uniqueValid(saved.retry, validGenera),
    completed: uniqueValid(saved.completed, validGenera),
    flawless: uniqueValid(saved.flawless, validGenera),
    currentGenus,
    pass: Math.max(saved.pass || 1, 1),
    finished: saved.finished,
    correct: Math.max(saved.correct || 0, 0),
    attempts: Math.max(saved.attempts || 0, 0),
  };
  if (progress.currentGenus) return progress;
  if (progress.finished && progress.flawless.length === rows.length) return progress;
  return advanceToNextPrompt(progress, rows);
}

export default function FamilyByGenus() {
  const [data, setData] = useState<Row[] | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [answer, setAnswer] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const dev = window.location.port === "3000";
    const url = dev
      ? "http://localhost:8080/games/data/genus_family.json"
      : "/games/data/genus_family.json";
    fetch(url)
      .then((r) => r.json())
      .then((rows: Row[]) => setData(rows))
      .catch((e) => console.error("Failed to load game data", e));
  }, []);

  useEffect(() => {
    if (!data) return;
    setProgress(sanitizeProgress(readStoredProgress(), data));
    setAnswer("");
    setFeedbacks([]);
  }, [data]);

  useEffect(() => {
    if (!progress) return;
    writeStoredProgress(progress);
  }, [progress]);

  const rowByGenus = useMemo(() => makeRowMap(data ?? []), [data]);
  const current = progress?.currentGenus
    ? (rowByGenus.get(progress.currentGenus) ?? null)
    : null;
  const total = data?.length ?? 0;
  const completed = progress?.completed.length ?? 0;
  const flawless = progress?.flawless.length ?? 0;
  const remainingThisPass =
    (progress?.queue.length ?? 0) + (progress?.currentGenus ? 1 : 0);
  const retryNext = progress?.retry.length ?? 0;
  const correct = progress?.correct ?? 0;
  const attempts = progress?.attempts ?? 0;
  const allFamilies = useMemo(() => {
    if (!data) return [] as string[];
    const s = new Set<string>();
    for (const row of data) s.add(row.family);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [data]);
  const familySuggestions = useMemo(() => {
    const q = answer.trim().toLowerCase();
    if (!q) return [] as string[];
    return allFamilies.filter((fam) => fam.toLowerCase().startsWith(q)).slice(0, 20);
  }, [allFamilies, answer]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !current || !progress) return;
    if (!answer.trim()) return;
    const prev = current;
    const isCorrect = answer.trim().toLowerCase() === prev.family.toLowerCase();
    const msg = isCorrect ? (
      <>
        <span role="img" aria-label="correct">
          ✅
        </span>{" "}
        <em>{prev.genus}</em>: Correct ({prev.family})
      </>
    ) : (
      <>
        <span role="img" aria-label="incorrect">
          ❌
        </span>{" "}
        <em>{prev.genus}</em>: Incorrect. Correct family: {prev.family}
      </>
    );
    setFeedbacks((arr) => [...arr, msg].slice(-10));
    setAnswer("");
    setProgress(
      advanceToNextPrompt(
        {
          ...progress,
          completed: addUnique(progress.completed, prev.genus),
          flawless: isCorrect
            ? addUnique(progress.flawless, prev.genus)
            : progress.flawless,
          retry: isCorrect
            ? removeValue(progress.retry, prev.genus)
            : addUnique(progress.retry, prev.genus),
          currentGenus: null,
          correct: progress.correct + (isCorrect ? 1 : 0),
          attempts: progress.attempts + 1,
        },
        data,
      ),
    );
  };

  const next = () => {
    if (!data || !current || !progress) return;
    const msg = <>Skipped {current.genus}; it will return in the next pass.</>;
    setFeedbacks((arr) => [...arr, msg].slice(-10));
    setAnswer("");
    setProgress(
      advanceToNextPrompt(
        {
          ...progress,
          retry: addUnique(progress.retry, current.genus),
          currentGenus: null,
        },
        data,
      ),
    );
  };

  function clearProgress() {
    if (!data) return;
    const nextProgress = advanceToNextPrompt(freshProgress(data), data);
    setProgress(nextProgress);
    setAnswer("");
    setFeedbacks([]);
  }

  function renderSettingsModal() {
    if (!isSettingsOpen) return null;
    return (
      <div className="game-modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
        <div
          className="game-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="family-progress-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="game-modal-header">
            <h3 id="family-progress-title">Progress</h3>
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
                {completed} / {total}
              </div>
            </div>
            <div className="progress-stat">
              <div className="progress-label">Flawless</div>
              <div className="progress-value">
                {flawless} / {total}
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
              <div className="progress-value">{retryNext}</div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn danger" type="button" onClick={clearProgress}>
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
          <h2 className="game-title">Family by Genus</h2>
          <div className="header-actions">
            <div className="score-pill" title="Correct / Attempts">
              {correct} / {attempts}
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
        <p className="game-subtitle">Given an extant mammal genus, enter its family.</p>

        {!current ? (
          progress?.finished ? (
            <div className="completion-panel">
              All {total} genera have been answered flawlessly.
            </div>
          ) : (
            <p className="loading">Loading data…</p>
          )
        ) : !data ? (
          <p className="loading">Loading data…</p>
        ) : (
          <>
            <div className="prompt">
              <div className="prompt-label">Genus</div>
              <div className="prompt-genus">
                <em>{current?.genus}</em>
              </div>
            </div>
            <form className="controls" onSubmit={submit}>
              <input
                className="answer-input"
                type="text"
                placeholder="Family (e.g., Muridae)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                list="familyOptions"
                autoFocus
              />
              <datalist id="familyOptions">
                {familySuggestions.map((fam) => (
                  <option key={fam} value={fam} />
                ))}
              </datalist>
              <div className="buttons">
                <button className="btn primary" type="submit">
                  Submit
                </button>
                <button className="btn" type="button" onClick={next}>
                  Skip
                </button>
              </div>
            </form>
            {feedbacks.length > 0 && (
              <div className="feedback-stream" aria-live="polite">
                {[...feedbacks].reverse().map((node, i) => (
                  <div className="feedback" key={i}>
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
