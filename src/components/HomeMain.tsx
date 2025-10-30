import React, { useEffect } from "react";

import SiteHeader from "./SiteHeader";
import SearchSection from "./SearchSection";
import SiteBody from "./SiteBody";
import HomeHero from "./HomeHero";

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
        <HomeHero />
        <SearchSection />
      </SiteBody>
    </>
  );
}
