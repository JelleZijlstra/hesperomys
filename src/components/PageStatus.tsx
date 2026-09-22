import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";

export default function PageStatus({
  kind,
  onRetry,
}: {
  kind: "not-found" | "error";
  onRetry?: (() => void) | null;
}) {
  const { pathname } = useLocation();
  const notFound = kind === "not-found";
  const title = notFound ? "Page not found" : "Unable to load this page";
  useEffect(() => {
    document.title = `${title} - Hesperomys`;
  }, [title]);

  return (
    <>
      <SiteHeader>
        <>{title}</>
      </SiteHeader>
      <SiteBody>
        <main className="page-status">
          {notFound && <p className="page-status-code">404</p>}
          <h1>{title}</h1>
          <p>
            {notFound
              ? "We couldn’t find a page at this address."
              : "There was a problem loading the data. Please try again."}
          </p>
          <p className="page-status-path">
            <code>{pathname}</code>
          </p>
          {notFound && <p>Check the address, search above, or browse the database.</p>}
          <nav className="page-status-actions" aria-label="Page recovery">
            {!notFound && (
              <button onClick={onRetry || (() => window.location.reload())}>
                Try again
              </button>
            )}
            <Link to="/">Browse the database</Link>
          </nav>
        </main>
      </SiteBody>
    </>
  );
}
