import React, { useEffect, useMemo, useState } from "react";
import ProgressDialog from "./ProgressDialog";
import "./GeneraByFamily.css";
export type ListRow = { parent: string; children: string[] };
type Labels = {
  title: string;
  parent: string;
  parents: string;
  child: string;
  children: string;
  placeholder: string;
  italicAnswers?: boolean;
};
type ModeKey = "normal" | "hard";
type Progress = {
  queue: string[];
  retry: string[];
  completed: string[];
  flawless: string[];
  currentParent: string | null;
  found: string[];
  masks: string[];
  currentFlawed: boolean;
  pass: number;
  finished: boolean;
};
type StoredState = {
  version: 3;
  hardMode: boolean;
  normal?: Progress;
  hard?: Progress;
};

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

function readStoredState(storageKey: string): StoredState | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version === 3) return parsed as StoredState;
    // Preserve existing Genera by Family saves from before the shared engine.
    if (parsed?.version === 2) {
      for (const mode of ["normal", "hard"]) {
        if (parsed[mode]) {
          parsed[mode].currentParent = parsed[mode].currentFamily;
          delete parsed[mode].currentFamily;
        }
      }
      return { ...parsed, version: 3 } as StoredState;
    }
  } catch {
    return null;
  }
  return null;
}

function initialHardMode(storageKey: string): boolean {
  return readStoredState(storageKey)?.hardMode ?? false;
}

function writeStoredState(storageKey: string, next: StoredState) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
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

function emptyMasks(row: ListRow): string[] {
  return row.children.map(() => "");
}

function makeRowMap(rows: ListRow[]): Map<string, ListRow> {
  const map = new Map<string, ListRow>();
  for (const row of rows) map.set(row.parent, row);
  return map;
}

function freshProgress(rows: ListRow[]): Progress {
  return {
    queue: shuffle(rows.map((row) => row.parent)),
    retry: [],
    completed: [],
    flawless: [],
    currentParent: null,
    found: [],
    masks: [],
    currentFlawed: false,
    pass: 1,
    finished: false,
  };
}

function advanceToNextParent(progress: Progress, rows: ListRow[]): Progress {
  const rowByParent = makeRowMap(rows);
  const validParents = new Set(rowByParent.keys());
  const flawless = uniqueValid(progress.flawless, validParents);
  const flawlessSet = new Set(flawless);
  const remainingParents = rows
    .map((row) => row.parent)
    .filter((parent) => !flawlessSet.has(parent));

  if (remainingParents.length === 0) {
    return {
      ...progress,
      queue: [],
      retry: [],
      flawless,
      currentParent: null,
      found: [],
      masks: [],
      currentFlawed: false,
      finished: true,
    };
  }

  let queue = uniqueValid(progress.queue, validParents).filter(
    (parent) => !flawlessSet.has(parent),
  );
  let retry = uniqueValid(progress.retry, validParents).filter(
    (parent) => !flawlessSet.has(parent),
  );
  let pass = progress.pass;

  if (queue.length === 0) {
    if (retry.length > 0) {
      queue = shuffle(retry);
      retry = [];
      pass += 1;
    } else {
      queue = shuffle(remainingParents);
      pass += 1;
    }
  }

  const [currentParent, ...rest] = queue;
  const row = rowByParent.get(currentParent);
  if (!row) return advanceToNextParent({ ...progress, queue: rest }, rows);
  return {
    ...progress,
    queue: rest,
    retry,
    flawless,
    currentParent,
    found: [],
    masks: emptyMasks(row),
    currentFlawed: false,
    pass,
    finished: false,
  };
}

function sanitizeProgress(saved: Progress | undefined, rows: ListRow[]): Progress {
  const validParents = new Set(rows.map((row) => row.parent));
  if (!saved) return advanceToNextParent(freshProgress(rows), rows);

  const rowByParent = makeRowMap(rows);
  const currentRow =
    saved.currentParent && validParents.has(saved.currentParent)
      ? rowByParent.get(saved.currentParent)
      : null;
  const found = currentRow
    ? uniqueValid(
        saved.found,
        new Set(currentRow.children.map((child) => child.toLowerCase())),
      )
    : [];
  const masks = currentRow
    ? currentRow.children.map((_, i) => saved.masks[i] ?? "")
    : [];
  const progress: Progress = {
    queue: uniqueValid(saved.queue, validParents),
    retry: uniqueValid(saved.retry, validParents),
    completed: uniqueValid(saved.completed, validParents),
    flawless: uniqueValid(saved.flawless, validParents),
    currentParent: currentRow ? currentRow.parent : null,
    found,
    masks,
    currentFlawed: saved.currentFlawed,
    pass: Math.max(saved.pass || 1, 1),
    finished: saved.finished,
  };
  if (progress.currentParent) return progress;
  if (progress.finished && progress.flawless.length === rows.length) return progress;
  return advanceToNextParent(progress, rows);
}

export default function ListByParent({
  rowsAll,
  storageKey,
  labels,
  renderBoard,
}: {
  rowsAll: ListRow[];
  storageKey: string;
  labels: Labels;
  renderBoard?: (row: ListRow, found: Set<string>, masks: string[]) => React.ReactNode;
}) {
  const AnswerName = labels.italicAnswers ? "em" : "span";
  const [hardMode, setHardMode] = useState(() => initialHardMode(storageKey));
  const rows = useMemo(() => {
    if (!rowsAll) return null;
    const filtered = hardMode ? rowsAll.filter((r) => r.children.length > 10) : rowsAll;
    return filtered;
  }, [rowsAll, hardMode]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [progressMode, setProgressMode] = useState<ModeKey>(() =>
    getModeKey(initialHardMode(storageKey)),
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<React.ReactNode | null>(null);
  const [feed, setFeed] = useState<React.ReactNode[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!rows) return;
    const stored = readStoredState(storageKey);
    const modeKey = getModeKey(hardMode);
    setProgressMode(modeKey);
    setProgress(sanitizeProgress(stored?.[modeKey], rows));
    setAnswer("");
    setFeedback(null);
    setFeed([]);
  }, [hardMode, rows, storageKey]);

  useEffect(() => {
    if (!progress) return;
    const modeKey = getModeKey(hardMode);
    if (progressMode !== modeKey) return;
    const stored = readStoredState(storageKey) ?? {
      version: 3,
      hardMode,
      normal: undefined,
    };
    writeStoredState(storageKey, {
      ...stored,
      version: 3,
      hardMode,
      [modeKey]: progress,
    });
  }, [hardMode, progress, progressMode, storageKey]);

  const rowByParent = useMemo(() => {
    return makeRowMap(rows ?? []);
  }, [rows]);
  const currentRow = progress?.currentParent
    ? (rowByParent.get(progress.currentParent) ?? null)
    : null;
  const found = useMemo(() => new Set(progress?.found ?? []), [progress]);
  const masks = progress?.masks ?? [];
  const totalParents = rows?.length ?? 0;
  const completedParents = progress?.completed.length ?? 0;
  const flawlessParents = progress?.flawless.length ?? 0;
  const remainingThisPass =
    (progress?.queue.length ?? 0) + (progress?.currentParent ? 1 : 0);
  const retryParents = progress?.retry.length ?? 0;
  const total = currentRow?.children.length ?? 0;
  const foundCount = found.size;
  const missing = useMemo(() => {
    if (!currentRow) return [] as string[];
    return currentRow.children.filter((g) => !found.has(g.toLowerCase()));
  }, [currentRow, found]);

  function resetCurrentMode() {
    if (!rows) return;
    const next = advanceToNextParent(freshProgress(rows), rows);
    const stored = readStoredState(storageKey) ?? { version: 3, hardMode };
    const modeKey = getModeKey(hardMode);
    writeStoredState(storageKey, {
      ...stored,
      version: 3,
      hardMode,
      [modeKey]: next,
    });
    setProgress(next);
    setAnswer("");
    setFeedback(null);
    setFeed([]);
  }

  function revealHint() {
    if (!currentRow || !progress) return;
    const missIdxs = currentRow.children
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
    if (!currentRow || !progress) return;
    const ans = normalize(answer);
    if (!ans) return;
    const idx = currentRow.children.findIndex((g) => normalize(g) === ans);
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
            <AnswerName>{currentRow.children[idx]}</AnswerName> added
          </>,
        );
      } else {
        setFeedback(
          <>
            <span role="img" aria-label="info">
              ℹ️
            </span>{" "}
            You already entered <AnswerName>{currentRow.children[idx]}</AnswerName>
          </>,
        );
      }
    } else {
      setFeedback(
        <>
          <span role="img" aria-label="incorrect">
            ❌
          </span>{" "}
          No match for <AnswerName>{answer}</AnswerName>
        </>,
      );
      setProgress({
        ...progress,
        currentFlawed: true,
      });
    }
    setAnswer("");
  }

  function skipParent() {
    if (!rows || !currentRow || !progress) return;
    const nextProgress = advanceToNextParent(
      {
        ...progress,
        retry: addUnique(progress.retry, currentRow.parent),
        currentParent: null,
        found: [],
        masks: [],
        currentFlawed: false,
      },
      rows,
    );
    const msg = <>Skipped {currentRow.parent}; it will return in the next pass.</>;
    setFeedback(null);
    setFeed((prev) => [msg, ...prev].slice(0, 10));
    setAnswer("");
    setProgress(nextProgress);
  }

  useEffect(() => {
    if (
      rows &&
      currentRow &&
      progress &&
      progress.found.length === currentRow.children.length &&
      currentRow.children.length > 0
    ) {
      const clean = !progress.currentFlawed;
      const msg = (
        <>
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          Completed {currentRow.parent}! ({progress.found.length}/
          {currentRow.children.length}
          {clean ? ", flawless" : ", retry later"})
        </>
      );
      setFeedback(
        <>
          {msg} Loading next {labels.parent.toLowerCase()}…
        </>,
      );
      setFeed((prev) => [msg, ...prev].slice(0, 10));
      // Brief pause to show completion, then move on
      const t = setTimeout(() => {
        setProgress((current) => {
          if (!current || current.currentParent !== currentRow.parent) return current;
          const completed = addUnique(current.completed, currentRow.parent);
          const flawless = clean
            ? addUnique(current.flawless, currentRow.parent)
            : current.flawless;
          const retry = clean
            ? removeValue(current.retry, currentRow.parent)
            : addUnique(current.retry, currentRow.parent);
          return advanceToNextParent(
            {
              ...current,
              completed,
              flawless,
              retry,
              currentParent: null,
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
  }, [progress, currentRow, rows, labels.parent]);

  useEffect(() => {
    if (progress?.finished) {
      setFeedback(
        <>
          All {totalParents} {labels.parents} have been completed flawlessly. Open
          progress to start over.
        </>,
      );
    }
  }, [progress?.finished, totalParents, labels.parents]);

  function renderSettingsModal() {
    if (!isSettingsOpen) return null;
    return (
      <ProgressDialog
        labelledBy="list-progress-title"
        onClose={() => setIsSettingsOpen(false)}
      >
        <div className="game-modal-header">
          <h3 id="list-progress-title">Progress</h3>
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
              {completedParents} / {totalParents}
            </div>
          </div>
          <div className="progress-stat">
            <div className="progress-label">Flawless</div>
            <div className="progress-value">
              {flawlessParents} / {totalParents}
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
            <div className="progress-value">{retryParents}</div>
          </div>
        </div>
        <label className="game-toggle modal-toggle">
          <input
            type="checkbox"
            checked={hardMode}
            onChange={(e) => setHardMode(e.target.checked)}
          />
          Hard mode (only {labels.parents} with more than 10 {labels.children})
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
      </ProgressDialog>
    );
  }

  return (
    <div className="game-root">
      <div className="game-card">
        <div className="game-header">
          <h1 className="game-title">{labels.title}</h1>
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
        <p className="game-subtitle">
          Name all {labels.children} in the given mammal {labels.parent.toLowerCase()}.
        </p>

        {rows?.length === 0 ? (
          <p role="status">
            No {labels.parents} with more than 10 {labels.children} in this selection.{" "}
            <button className="btn" onClick={() => setHardMode(false)}>
              Turn off hard mode
            </button>
          </p>
        ) : !currentRow ? (
          progress?.finished ? (
            <div className="completion-panel">
              All {totalParents} {labels.parents} have been completed flawlessly.
            </div>
          ) : (
            <p className="loading">Loading…</p>
          )
        ) : (
          <>
            <div className="prompt">
              <div className="prompt-label">{labels.parent}</div>
              <div className="prompt-genus">{currentRow.parent}</div>
            </div>

            <form className="controls" onSubmit={submit}>
              <input
                className="answer-input"
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                aria-label={labels.child}
                placeholder={labels.placeholder}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
              />
              <div className="buttons">
                <button className="btn primary" type="submit" disabled={!answer.trim()}>
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
                <button className="btn" type="button" onClick={skipParent}>
                  Skip
                </button>
              </div>
            </form>

            {renderBoard?.(currentRow, found, masks) || (
              <div className="taxon-viewport">
                <div className="genera-board">
                  {currentRow.children.map((g, i) => {
                    const foundIt = found.has(g.toLowerCase());
                    return (
                      <div
                        key={g}
                        className={"genera-chip" + (foundIt ? " found" : " missing")}
                      >
                        {foundIt ? (
                          <AnswerName>{g}</AnswerName>
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
