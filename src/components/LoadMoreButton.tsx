import React, { useEffect, useRef, useState } from "react";
import { RelayPaginationProp } from "react-relay";
import LoadError from "./LoadError";

interface LoadMoreButtonProps {
  numToLoad?: number;
  relay: RelayPaginationProp;
}

export default function LoadMoreButton({
  numToLoad = 1000,
  relay,
}: LoadMoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const mounted = useRef(true);
  const pending = useRef(false);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const loadMore = () => {
    if (pending.current || !relay.hasMore() || relay.isLoading()) return;
    pending.current = true;
    setLoading(true);
    setFailed(false);
    relay.loadMore(numToLoad, (error) => {
      pending.current = false;
      if (!mounted.current) return;
      setLoading(false);
      setFailed(!!error);
    });
  };

  if (!relay.hasMore() && !loading && !failed) return null;
  return (
    <div className="pagination-controls">
      {failed ? (
        <LoadError
          message="More records could not be loaded. Your existing results are still shown."
          onRetry={loadMore}
        />
      ) : (
        <button type="button" onClick={loadMore} disabled={loading}>
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
