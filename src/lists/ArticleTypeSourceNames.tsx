import * as React from "react";

import { ArticleTypeSourceNames_article } from "./__generated__/ArticleTypeSourceNames_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class ArticleTypeSourceNames extends React.Component<{
  article: ArticleTypeSourceNames_article;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { article, relay, title } = this.props;
    if (
      !article.typeSourceNames ||
      article.typeSourceNames.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "TypeSourceNames"}</h3>
        <ul>
          {article.typeSourceNames.edges.map(
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
  ArticleTypeSourceNames,
  {
    article: graphql`
      fragment ArticleTypeSourceNames_article on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        typeSourceNames(first: $count, after: $cursor)
          @connection(key: "ArticleTypeSourceNames_typeSourceNames") {
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
    getConnectionFromProps: (props) => props.article.typeSourceNames,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleTypeSourceNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleTypeSourceNames_article
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
