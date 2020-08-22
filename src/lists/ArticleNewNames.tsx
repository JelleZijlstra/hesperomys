import * as React from "react";

import { ArticleNewNames_article } from "./__generated__/ArticleNewNames_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

class ArticleNewNames extends React.Component<{
  article: ArticleNewNames_article;
  title?: string;
  relay: RelayPaginationProp;
}> {
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
          <button onClick={() => this._loadMore()}>Load More</button>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(10, (error) => {
      console.log(error);
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
