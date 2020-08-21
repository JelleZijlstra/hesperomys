import * as React from "react";

import { ArticleArticleSet_article } from "./__generated__/ArticleArticleSet_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class ArticleArticleSet extends React.Component<{
  article: ArticleArticleSet_article;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { article, relay, title } = this.props;
    if (!article.articleSet || article.articleSet.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "ArticleSet"}</h3>
        <ul>
          {article.articleSet.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <li key={edge.node.oid}>
                  <ModelLink model={edge.node} />
                </li>
              )
          )}
        </ul>
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
  ArticleArticleSet,
  {
    article: graphql`
      fragment ArticleArticleSet_article on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        articleSet(first: $count, after: $cursor)
          @connection(key: "ArticleArticleSet_articleSet") {
          edges {
            node {
              oid
              ...ModelLink_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.article.articleSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleArticleSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleArticleSet_article
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
