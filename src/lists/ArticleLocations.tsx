import * as React from "react";

import { ArticleLocations_article } from "./__generated__/ArticleLocations_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

class ArticleLocations extends React.Component<{
  article: ArticleLocations_article;
  title?: string;
  relay: RelayPaginationProp;
}> {
  render() {
    const { article, relay, title } = this.props;
    if (!article.locations || article.locations.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Locations"}</h3>
        <ul>
          {article.locations.edges.map(
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
  ArticleLocations,
  {
    article: graphql`
      fragment ArticleLocations_article on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        locations(first: $count, after: $cursor)
          @connection(key: "ArticleLocations_locations") {
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
    getConnectionFromProps: (props) => props.article.locations,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleLocationsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleLocations_article @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
