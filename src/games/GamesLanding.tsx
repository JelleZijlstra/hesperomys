import React from "react";
import { Link } from "react-router-dom";
import "./GamesLanding.css";

export default function GamesLanding() {
  return (
    <div className="games-landing-root">
      <div className="games-landing-card">
        <h2 className="games-landing-title">Hesperomys Games</h2>
        <p className="games-landing-subtitle">
          Sharpen your taxonomy skills with quick quizzes. Choose a continent in any
          game to practice your local mammals.
        </p>
        <div className="games-grid">
          <Link className="game-tile" to="/games/order-by-family">
            <div className="game-tile-title">Order by Family</div>
            <div className="game-tile-desc">
              Start here: place mammal families into their orders. Type an order with
              autocomplete suggestions.
            </div>
          </Link>
          <Link className="game-tile" to="/games/families-by-order">
            <div className="game-tile-title">Families by Order</div>
            <div className="game-tile-desc">
              Given a mammal order, list all its families.
            </div>
          </Link>
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
