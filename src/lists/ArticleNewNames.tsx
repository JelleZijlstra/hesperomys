import * as React from "react";

import { ArticleNewNames_article } from "./__generated__/ArticleNewNames_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface ArticleNewNamesProps {
  article: ArticleNewNames_article;
  title?: string;
  relay: RelayPaginationProp;
}

class ArticleNewNames extends React.Component<
  ArticleNewNamesProps,
  { numToLoad: number | null }
> {
  constructor(props: ArticleNewNamesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { article, relay, title } = this.props;
    if (!article.newNames || article.newNames.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "NewNames"}</h3>
        <NameList connection={article.newNames} />
        {relay.hasMore() && (
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad || ""}
              onChange={(e) => {
                if (!e.target.value) {
                  this.setState({ numToLoad: null });
                  return;
                }
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  this.setState({ numToLoad: parseInt(e.target.value) });
                }
              }}
            />
            {" More"}
          </div>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(this.state.numToLoad || 10, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

export default createPaginationContainer(
  ArticleNewNames,
  {
    article: graphql`
      fragment ArticleNewNames_article on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        newNames(first: $count, after: $cursor)
          @connection(key: "ArticleNewNames_newNames") {
          edges {
            node {
              oid
            }
          }
          ...NameList_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.article.newNames,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleNewNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleNewNames_article @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
