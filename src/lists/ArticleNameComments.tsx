import * as React from "react";

import { ArticleNameComments_article } from "./__generated__/ArticleNameComments_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class ArticleNameComments extends React.Component<{
  article: ArticleNameComments_article;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { article, relay, title } = this.props;
    if (!article.nameComments || article.nameComments.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "NameComments"}</h3>
        <ul>
          {article.nameComments.edges.map(
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
  ArticleNameComments,
  {
    article: graphql`
      fragment ArticleNameComments_article on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        nameComments(first: $count, after: $cursor)
          @connection(key: "ArticleNameComments_nameComments") {
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
    getConnectionFromProps: (props) => props.article.nameComments,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleNameCommentsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleNameComments_article
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
