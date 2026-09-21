import React from "react";

export default function CoordinatesLink({
  latitude,
  longitude,
  openstreetmapUrl,
}: {
  latitude: string;
  longitude: string;
  openstreetmapUrl?: string | null;
}) {
  const fallbackUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    `${latitude}, ${longitude}`,
  )}`;
  return (
    <a href={openstreetmapUrl || fallbackUrl} title="View on OpenStreetMap">
      {latitude}, {longitude}
    </a>
  );
}
