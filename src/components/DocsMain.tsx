import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Docs from "./Docs";

export default function DocsMain() {
  const { "0": path } = useParams() as any;
  useEffect(() => {
    document.title = "Hesperomys - " + path;
  }, [path]);
  return <Docs path={path} />;
}
