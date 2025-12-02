import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./FamilyByGenus.css";

type Row = { genus: string; family: string };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FamilyByGenus() {
  const [data, setData] = useState<Row[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);
  const [feedbacks, setFeedbacks] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const dev = window.location.port === "3000";
    const url = dev
      ? "http://localhost:8080/games/data/genus_family.json"
      : "/games/data/genus_family.json";
    fetch(url)
      .then((r) => r.json())
      .then((rows: Row[]) => setData(shuffle(rows)))
      .catch((e) => console.error("Failed to load game data", e));
  }, []);

  const current = useMemo(() => (data ? data[idx % data.length] : null), [data, idx]);
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
    if (!current) return;
    const prev = current;
    const isCorrect = answer.trim().toLowerCase() === prev.family.toLowerCase();
    setAttempts((a) => a + 1);
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
    if (isCorrect) setCorrect((c) => c + 1);
    setFeedbacks((arr) => [...arr, msg].slice(-10));
    // Immediately move to the next genus
    setAnswer("");
    setIdx((i) => i + 1);
  };

  const next = () => {
    setAnswer("");
    setIdx((i) => i + 1);
  };

  if (done) {
    return (
      <div className="game-root">
        <div className="game-card">
          <h2 className="game-title">Family by Genus — Score</h2>
          <p className="score-text">
            You scored {correct} / {attempts}
          </p>
          <div className="buttons" style={{ marginTop: 12 }}>
            <Link className="btn" to="/games">
              Back to Games
            </Link>
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
          <div className="score-pill" title="Correct / Attempts">
            {correct} / {attempts}
          </div>
        </div>
        <p className="game-subtitle">Given an extant mammal genus, enter its family.</p>

        {!data ? (
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
                <button
                  className="btn danger"
                  type="button"
                  onClick={() => setDone(true)}
                >
                  Exit
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
    </div>
  );
}
