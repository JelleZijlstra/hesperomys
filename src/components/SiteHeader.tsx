import React from "react";
import { Link } from "react-router-dom";

export default function SiteHeader({
  children,
  subtitle,
}: {
  children: JSX.Element;
  subtitle?: JSX.Element;
}) {
  return (
    <div className="header">
      <div className="home-link">
        <Link to="/">
          <i>Hesperomys</i>
        </Link>
      </div>
      <div className="page-title">
        {children}
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
