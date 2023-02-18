import React, { useEffect } from "react";

import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import FullSearch from "./FullSearch";

export default function HomeMain() {
  useEffect(() => {
    document.title = "Hesperomys - Search";
  }, []);
  return (
    <>
      <SiteHeader>
        <>Search</>
      </SiteHeader>
      <SiteBody>
        <FullSearch />
      </SiteBody>
    </>
  );
}
