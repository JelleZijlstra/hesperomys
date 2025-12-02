import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./FamilyByGenus.css";

type Row = { genus: string; species: string[] };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SpeciesByGenus() {
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
      ? "http://localhost:8080/games/data/genus_species.json"
      : "/games/data/genus_species.json";
    fetch(url)
      .then((r) => r.json())
      .then((rows: Row[]) => setData(shuffle(rows)))
      .catch((e) => console.error("Failed to load game data", e));
  }, []);

  const current = useMemo(() => (data ? data[idx % data.length] : null), [data, idx]);

  function isCorrectAnswer(
    genus: string,
    speciesList: string[],
    input: string,
  ): boolean {
    const normalized = input.trim().toLowerCase();
    if (!normalized) return false;
    // Accept epithet only
    if (speciesList.some((sp) => sp.toLowerCase() === normalized)) return true;
    // Accept full binomial
    const expectedPrefix = genus.toLowerCase() + " ";
    if (normalized.startsWith(expectedPrefix)) {
      const epithet = normalized.slice(expectedPrefix.length);
      if (speciesList.some((sp) => sp.toLowerCase() === epithet)) return true;
    }
    return false;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    const prev = current;
    const ok = isCorrectAnswer(prev.genus, prev.species, answer);
    setAttempts((a) => a + 1);
    const msg = ok ? (
      <>
        <span role="img" aria-label="correct">
          ✅
        </span>{" "}
        <em>{prev.genus}</em> — nice!
      </>
    ) : (
      (() => {
        const MAX_SHOW = 12;
        const examples = prev.species.slice(0, MAX_SHOW);
        return (
          <>
            <span role="img" aria-label="incorrect">
              ❌
            </span>{" "}
            <em>{prev.genus}</em>: no match for <em>{answer}</em>. Accepted species
            include:{" "}
            {examples.map((sp, i) => (
              <React.Fragment key={sp}>
                <em>
                  {prev.genus} {sp}
                </em>
                {i < examples.length - 1 ? ", " : ""}
              </React.Fragment>
            ))}
            {prev.species.length > MAX_SHOW ? (
              <span> and {prev.species.length - MAX_SHOW} more</span>
            ) : null}
          </>
        );
      })()
    );
    if (ok) setCorrect((c) => c + 1);
    setFeedbacks((arr) => [...arr, msg].slice(-10));
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
          <h2 className="game-title">Species by Genus — Score</h2>
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
          <h2 className="game-title">Species by Genus</h2>
          <div className="score-pill" title="Correct / Attempts">
            {correct} / {attempts}
          </div>
        </div>
        <p className="game-subtitle">Given a genus, enter any species in that genus.</p>

        {!current ? (
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
                placeholder="Species (e.g., musculus or Mus musculus)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
              />
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
                {[...feedbacks]
                  .slice(-10)
                  .reverse()
                  .map((node, i) => (
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
