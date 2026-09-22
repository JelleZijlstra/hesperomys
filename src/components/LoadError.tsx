import React from "react";

export default function LoadError({
  onRetry,
  message = "There was a problem loading the data.",
}: {
  onRetry?: (() => void) | null;
  message?: string;
}) {
  return (
    <div className="load-error" role="alert">
      <p>{message}</p>
      <button type="button" onClick={onRetry || (() => window.location.reload())}>
        Try again
      </button>
    </div>
  );
}
