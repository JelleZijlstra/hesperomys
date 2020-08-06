import React from "react";
import { Link } from "react-router-dom";

export default function SiteHeader({ children }: { children: JSX.Element }) {
  return (
    <div className="header">
      <div className="home-link">
        <Link to="/">
          <i>Hesperomys</i>
        </Link>
      </div>
      <div className="page-title">{children}</div>
    </div>
  );
}
