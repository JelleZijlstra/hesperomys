import React, { useEffect, useMemo, useState } from "react";
import "./FamilyByGenus.css";

type Row = { child: string; parent: string };
type Progress = {
  queue: string[];
  retry: string[];
  completed: string[];
  flawless: string[];
  currentChild: string | null;
  pass: number;
  finished: boolean;
  correct: number;
  attempts: number;
};
type StoredState = {
  version: 1 | 2;
  progress: Progress;
};

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

function readStoredProgress(storageKey: string): Progress | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed?.version === 1 || parsed?.version === 2) {
      const progress = parsed.progress;
      // Migrate the original Family by Genus save format in place.
      const legacy = progress as Progress & { currentGenus?: string | null };
      return {
        ...progress,
        currentChild: progress.currentChild || legacy.currentGenus || null,
      };
    }
  } catch {
    return null;
  }
  return null;
}

function writeStoredProgress(storageKey: string, progress: Progress) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ version: 2, progress }));
  } catch {
    // Losing saved game state is better than blocking play.
  }
}

function makeRowMap(rows: Row[]): Map<string, Row> {
  const map = new Map<string, Row>();
  for (const row of rows) map.set(row.child, row);
  return map;
}

function freshProgress(rows: Row[]): Progress {
  return {
    queue: shuffle(rows.map((row) => row.child)),
    retry: [],
    completed: [],
    flawless: [],
    currentChild: null,
    pass: 1,
    finished: false,
    correct: 0,
    attempts: 0,
  };
}

function advanceToNextPrompt(progress: Progress, rows: Row[]): Progress {
  const rowByChild = makeRowMap(rows);
  const validGenera = new Set(rowByChild.keys());
  const flawless = uniqueValid(progress.flawless, validGenera);
  const flawlessSet = new Set(flawless);
  const remainingGenera = rows
    .map((row) => row.child)
    .filter((child) => !flawlessSet.has(child));

  if (remainingGenera.length === 0) {
    return {
      ...progress,
      queue: [],
      retry: [],
      flawless,
      currentChild: null,
      finished: true,
    };
  }

  let queue = uniqueValid(progress.queue, validGenera).filter(
    (child) => !flawlessSet.has(child),
  );
  let retry = uniqueValid(progress.retry, validGenera).filter(
    (child) => !flawlessSet.has(child),
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

  const [currentChild, ...rest] = queue;
  if (!rowByChild.has(currentChild)) {
    return advanceToNextPrompt({ ...progress, queue: rest }, rows);
  }
  return {
    ...progress,
    queue: rest,
    retry,
    flawless,
    currentChild,
    pass,
    finished: false,
  };
}

function sanitizeProgress(saved: Progress | null, rows: Row[]): Progress {
  const validGenera = new Set(rows.map((row) => row.child));
  if (!saved) return advanceToNextPrompt(freshProgress(rows), rows);

  const currentChild =
    saved.currentChild && validGenera.has(saved.currentChild)
      ? saved.currentChild
      : null;
  const progress: Progress = {
    queue: uniqueValid(saved.queue, validGenera),
    retry: uniqueValid(saved.retry, validGenera),
    completed: uniqueValid(saved.completed, validGenera),
    flawless: uniqueValid(saved.flawless, validGenera),
    currentChild,
    pass: Math.max(saved.pass || 1, 1),
    finished: saved.finished,
    correct: Math.max(saved.correct || 0, 0),
    attempts: Math.max(saved.attempts || 0, 0),
  };
  if (progress.currentChild) return progress;
  if (progress.finished && progress.flawless.length === rows.length) return progress;
  return advanceToNextPrompt(progress, rows);
}

export default function ParentByChild({
  data,
  storageKey,
  title,
  promptLabel,
  answerLabel,
  placeholder,
}: {
  data: Row[];
  storageKey: string;
  title: string;
  promptLabel: string;
  answerLabel: string;
  placeholder: string;
}) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [answer, setAnswer] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!data) return;
    setProgress(sanitizeProgress(readStoredProgress(storageKey), data));
    setAnswer("");
    setFeedbacks([]);
  }, [data, storageKey]);

  useEffect(() => {
    if (!progress) return;
    writeStoredProgress(storageKey, progress);
  }, [progress, storageKey]);

  const rowByChild = useMemo(() => makeRowMap(data ?? []), [data]);
  const current = progress?.currentChild
    ? (rowByChild.get(progress.currentChild) ?? null)
    : null;
  const total = data?.length ?? 0;
  const completed = progress?.completed.length ?? 0;
  const flawless = progress?.flawless.length ?? 0;
  const remainingThisPass =
    (progress?.queue.length ?? 0) + (progress?.currentChild ? 1 : 0);
  const retryNext = progress?.retry.length ?? 0;
  const correct = progress?.correct ?? 0;
  const attempts = progress?.attempts ?? 0;
  const allParents = useMemo(() => {
    if (!data) return [] as string[];
    const s = new Set<string>();
    for (const row of data) s.add(row.parent);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [data]);
  const parentSuggestions = useMemo(() => {
    const q = answer.trim().toLowerCase();
    if (!q) return [] as string[];
    return allParents.filter((fam) => fam.toLowerCase().startsWith(q)).slice(0, 20);
  }, [allParents, answer]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !current || !progress) return;
    if (!answer.trim()) return;
    const prev = current;
    const isCorrect = answer.trim().toLowerCase() === prev.parent.toLowerCase();
    const msg = isCorrect ? (
      <>
        <span role="img" aria-label="correct">
          ✅
        </span>{" "}
        <span>{prev.child}</span>: Correct ({prev.parent})
      </>
    ) : (
      <>
        <span role="img" aria-label="incorrect">
          ❌
        </span>{" "}
        <span>{prev.child}</span>: Incorrect. Correct {answerLabel.toLowerCase()}:{" "}
        {prev.parent}
      </>
    );
    setFeedbacks((arr) => [...arr, msg].slice(-10));
    setAnswer("");
    setProgress(
      advanceToNextPrompt(
        {
          ...progress,
          completed: addUnique(progress.completed, prev.child),
          flawless: isCorrect
            ? addUnique(progress.flawless, prev.child)
            : progress.flawless,
          retry: isCorrect
            ? removeValue(progress.retry, prev.child)
            : addUnique(progress.retry, prev.child),
          currentChild: null,
          correct: progress.correct + (isCorrect ? 1 : 0),
          attempts: progress.attempts + 1,
        },
        data,
      ),
    );
  };

  const next = () => {
    if (!data || !current || !progress) return;
    const msg = <>Skipped {current.child}; it will return in the next pass.</>;
    setFeedbacks((arr) => [...arr, msg].slice(-10));
    setAnswer("");
    setProgress(
      advanceToNextPrompt(
        {
          ...progress,
          retry: addUnique(progress.retry, current.child),
          currentChild: null,
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
          aria-labelledby="parent-progress-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="game-modal-header">
            <h3 id="parent-progress-title">Progress</h3>
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
          <h2 className="game-title">{title}</h2>
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
        <p className="game-subtitle">
          Given a mammal {promptLabel.toLowerCase()}, enter its{" "}
          {answerLabel.toLowerCase()}.
        </p>

        {!current ? (
          progress?.finished ? (
            <div className="completion-panel">
              All {total} prompts have been answered flawlessly.
            </div>
          ) : (
            <p className="loading">Loading data…</p>
          )
        ) : !data ? (
          <p className="loading">Loading data…</p>
        ) : (
          <>
            <div className="prompt">
              <div className="prompt-label">{promptLabel}</div>
              <div className="prompt-genus">
                {promptLabel === "Genus" ? <em>{current.child}</em> : current.child}
              </div>
            </div>
            <form className="controls" onSubmit={submit}>
              <input
                className="answer-input"
                type="text"
                aria-label={answerLabel}
                placeholder={placeholder}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                list="parentOptions"
                autoFocus
              />
              <datalist id="parentOptions">
                {parentSuggestions.map((parent) => (
                  <option key={parent} value={parent} />
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
