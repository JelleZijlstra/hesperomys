import * as React from "react";

interface ExpandButtonsProps {
  expandAll?: boolean;
  setExpandAll?: (expandAll: boolean) => void;
  showChildren?: boolean;
  setShowChildren?: (showChildren: boolean) => void;
  showDetail?: boolean;
  setShowDetail?: (showDetail: boolean) => void;
}

export default function ExpandButtons({
  expandAll,
  setExpandAll,
  showChildren,
  setShowChildren,
  showDetail,
  setShowDetail,
}: ExpandButtonsProps) {
  const components: [string, JSX.Element][] = [];
  if (setExpandAll) {
    components.push([
      "expand-all",
      <button onClick={() => setExpandAll(!expandAll)}>
        {expandAll ? "unexpand all" : "expand all"}
      </button>,
    ]);
  }
  if (setShowChildren) {
    components.push([
      "show-children",
      <button onClick={() => setShowChildren(!showChildren)}>
        {showChildren ? "hide children" : "show children"}
      </button>,
    ]);
  }
  if (setShowDetail) {
    components.push([
      "show-detail",
      <button key="show-detail" onClick={() => setShowDetail(!showDetail)}>
        {showDetail ? "hide detail" : "show detail"}
      </button>,
    ]);
  }
  if (components.length === 0) {
    return null;
  }
  return (
    <div>
      <small>
        {components.map(([key, component], i) => (
          <React.Fragment key={key}>
            {i > 0 && " or "}
            {component}
          </React.Fragment>
        ))}
      </small>
    </div>
  );
}
