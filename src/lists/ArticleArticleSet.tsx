import * as React from "react";

import { ArticleArticleSet_article } from "./__generated__/ArticleArticleSet_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface ArticleArticleSetProps {
  article: ArticleArticleSet_article;
  title?: string;
  relay: RelayPaginationProp;
}

class ArticleArticleSet extends React.Component<
  ArticleArticleSetProps,
  { numToLoad: number }
> {
  constructor(props: ArticleArticleSetProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

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
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad}
              onChange={(e) => {
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

    relay.loadMore(this.state.numToLoad, (error) => {
      if (error) {
        console.log(error);
      }
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
