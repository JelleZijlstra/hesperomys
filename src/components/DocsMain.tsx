import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import Docs from "./Docs";

export default function DocsMain() {
  const { path } = useParams();
  useEffect(() => {
    document.title = "Hesperomys - " + path;
  }, [path]);
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
