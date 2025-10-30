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
  const buttons: JSX.Element[] = [];
  if (setExpandAll) {
    buttons.push(
      <button
        key="expand-all"
        className="btn btn-small"
        onClick={() => setExpandAll(!expandAll)}
        title={expandAll ? "Collapse all child lists" : "Expand all child lists"}
      >
        {expandAll ? "Collapse all" : "Expand all"}
      </button>,
    );
  }
  if (setShowChildren) {
    buttons.push(
      <button
        key="show-children"
        className="btn btn-small"
        onClick={() => setShowChildren(!showChildren)}
        title={showChildren ? "Hide children" : "Show children"}
      >
        {showChildren ? "Hide children" : "Show children"}
      </button>,
    );
  }
  if (setShowDetail) {
    buttons.push(
      <button
        key="show-detail"
        className="btn btn-small"
        onClick={() => setShowDetail(!showDetail)}
        title={showDetail ? "Hide extra detail" : "Show extra detail"}
      >
        {showDetail ? "Hide detail" : "Show detail"}
      </button>,
    );
  }
  if (buttons.length === 0) return null;
  return (
    <div className="expand-buttons">
      <small className="button-group">{buttons}</small>
    </div>
  );
}
