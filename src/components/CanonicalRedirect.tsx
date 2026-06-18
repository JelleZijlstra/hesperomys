import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Normalizes URLs by removing trailing slashes (except for root "/").
export default function CanonicalRedirect() {
  const location = useLocation();

  useEffect(() => {
    const { pathname, search, hash } = location;
    // Keep root "/" as-is; strip one or more trailing slashes elsewhere.
    if (pathname.length > 1 && /\/$/.test(pathname)) {
      const normalizedPath = pathname.replace(/\/+$/, "");
      const target = `${normalizedPath}${search || ""}${hash || ""}`;
      if (typeof window !== "undefined" && window.history?.replaceState) {
        window.history.replaceState(null, "", target);
      }
    }
  }, [location]);

  return null;
}
