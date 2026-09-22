import { getGraphQLUrl } from "../relayEnvironment";

// Documentation attachments live with the backend, even when React is served separately.
export function getDocumentationAssetUrl(uri: string, path: string): string {
  const page = new URL(`/docs/${path}`, window.location.origin);
  let target: URL;
  try {
    target = new URL(uri, page);
  } catch {
    return uri;
  }
  if (
    target.origin !== page.origin ||
    !target.pathname.startsWith("/docs/") ||
    !/\.[^/]+$/.test(target.pathname)
  ) {
    return uri;
  }
  const backend = new URL(getGraphQLUrl(), window.location.href);
  return new URL(target.pathname + target.search + target.hash, backend).href;
}
