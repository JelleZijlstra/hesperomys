import React, { useEffect } from "react";

import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import FullSearch from "./FullSearch";

export default function SearchMain() {
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
