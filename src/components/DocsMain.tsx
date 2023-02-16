import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import SiteHeader from "./SiteHeader";
import SiteBody from "./SiteBody";
import Docs from "./Docs";

export default function DocsMain() {
  const { "0": path } = useParams() as any;
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
