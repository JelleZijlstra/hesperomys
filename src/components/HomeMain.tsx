import React, { useEffect } from "react";

import Docs from "./Docs";
import SiteHeader from "./SiteHeader";
import SearchSection from "./SearchSection";
import SiteBody from "./SiteBody";

export default function HomeMain() {
  useEffect(() => {
    document.title = "Hesperomys - Home";
  }, []);
  return (
    <>
      <SiteHeader>
        <>Home</>
      </SiteHeader>
      <SiteBody>
        <SearchSection />
        <Docs path="home" />
      </SiteBody>
    </>
  );
}
