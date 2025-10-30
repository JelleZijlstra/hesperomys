import React from "react";
import { Link } from "react-router-dom";

export default function HomeHero() {
  return (
    <div className="home-hero">
      <h1 className="home-hero-title">Hesperomys</h1>
      <p className="home-hero-text">
        Explore the taxonomy and nomenclature of mammals and other animals. Search by
        scientific name or browse related data such as taxa, collections, and places.
        The data synthesizes original descriptions and subsequent literature.
      </p>
      <div className="home-hero-links">
        <Link to="/docs/home">Learn more</Link>
      </div>
    </div>
  );
}
