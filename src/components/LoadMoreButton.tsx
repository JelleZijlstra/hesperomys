import * as React from "react";
import { RelayPaginationProp } from "react-relay";

interface LoadMoreButtonProps {
  numToLoad: number;
  relay: RelayPaginationProp;
  expandAll?: boolean;
  setExpandAll?: (expandAll: boolean) => void;
  showChildren?: boolean;
  setShowChildren?: (showChildren: boolean) => void;
  showDetail?: boolean;
  setShowDetail?: (showDetail: boolean) => void;
}

export default class LoadMoreButton extends React.Component<
  LoadMoreButtonProps,
  { value: number }
> {
  constructor(props: LoadMoreButtonProps) {
    super(props);
    this.state = { value: props.numToLoad };
  }
  render() {
    const {
      relay,
      expandAll,
      setExpandAll,
      showChildren,
      setShowChildren,
      showDetail,
      setShowDetail,
    } = this.props;
    const hasMore = relay.hasMore();
    const components = [];
    if (hasMore) {
      components.push(
        <>
          <button onClick={() => this._loadMore()}>Load</button>{" "}
          <input
            type="text"
            value={this.state.value}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                this.setState({ value });
              }
            }}
          />
          {" more"}
        </>
      );
    }
    if (setExpandAll) {
      components.push(
        <span onClick={() => setExpandAll(!expandAll)}>
          {expandAll ? "unexpand all" : "expand all"}
        </span>
      );
    }
    if (setShowChildren) {
      components.push(
        <span onClick={() => setShowChildren(!showChildren)}>
          {showChildren ? "hide children" : "show children"}
        </span>
      );
    }
    if (setShowDetail) {
      components.push(
        <span onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? "hide detail" : "show detail"}
        </span>
      );
    }
    if (components.length === 0) {
      return null;
    }
    return (
      <div>
        <small>
          {components.map((component, i) => (
            <>
              {i > 0 && " or "}
              {component}
            </>
          ))}
        </small>
      </div>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(this.state.value, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}
