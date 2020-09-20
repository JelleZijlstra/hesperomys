import React from "react";

import Docs from "./Docs";
import SiteHeader from "./SiteHeader";
import SearchSection from "./SearchSection";
import SiteBody from "./SiteBody";

export default function HomeMain() {
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
