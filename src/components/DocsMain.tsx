import React from "react";
import { useParams } from "react-router-dom";

import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import Docs from "./Docs";

export default function DocsMain() {
  const { path } = useParams();
  return (
    <>
      <SiteHeader>
        <>Documentation</>
      </SiteHeader>
      <SiteBody>
        <Docs path={path} />
      </SiteBody>
    </>
  );
}
