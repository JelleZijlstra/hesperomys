import * as React from "react";
import { RelayPaginationProp } from "react-relay";

interface LoadMoreButtonProps {
  numToLoad: number;
  relay: RelayPaginationProp;
  expandAll?: boolean;
  setExpandAll?: (expandAll: boolean) => void;
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
    const { relay, expandAll, setExpandAll } = this.props;
    const hasMore = relay.hasMore();
    if (!hasMore && !setExpandAll) {
      return null;
    }
    return (
      <div>
        <small>
          {hasMore && (
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
          )}
          {setExpandAll && hasMore && <> or </>}
          {setExpandAll && (
            <span onClick={() => setExpandAll(!expandAll)}>
              {expandAll ? "unexpand all" : "expand all"}
            </span>
          )}
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
