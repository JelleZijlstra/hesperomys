import * as React from "react";
import { RelayPaginationProp } from "react-relay";

interface LoadMoreButtonProps {
  numToLoad?: number;
  relay: RelayPaginationProp;
}

const DEFAULT_LOAD_MORE = 1000;

export default class LoadMoreButton extends React.Component<LoadMoreButtonProps> {
  render() {
    const { relay } = this.props;
    if (!relay.hasMore()) {
      return null;
    }
    return <button onClick={() => this._loadMore()}>load more</button>;
  }

  _loadMore() {
    const { relay, numToLoad } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(numToLoad || DEFAULT_LOAD_MORE, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}
