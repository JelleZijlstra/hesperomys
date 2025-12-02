import React from "react";
import { Link } from "react-router-dom";
import "./GamesLanding.css";

export default function GamesLanding() {
  return (
    <div className="games-landing-root">
      <div className="games-landing-card">
        <h2 className="games-landing-title">Hesperomys Games</h2>
        <p className="games-landing-subtitle">
          Sharpen your taxonomy skills with quick quizzes.
        </p>
        <div className="games-grid">
          <Link className="game-tile" to="/games/family-by-genus">
            <div className="game-tile-title">Family by Genus</div>
            <div className="game-tile-desc">Given a mammal genus, name its family.</div>
          </Link>
          <Link className="game-tile" to="/games/genera-by-family">
            <div className="game-tile-title">Genera by Family</div>
            <div className="game-tile-desc">Given a family, list all its genera.</div>
          </Link>
          <Link className="game-tile" to="/games/species-by-genus">
            <div className="game-tile-title">Species by Genus</div>
            <div className="game-tile-desc">
              Given a genus, name any species in that genus.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
