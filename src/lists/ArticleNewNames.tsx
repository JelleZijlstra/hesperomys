import * as React from "react";

import { ArticleNewNames_article } from "./__generated__/ArticleNewNames_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface ArticleNewNamesProps {
  article: ArticleNewNames_article;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class ArticleNewNames extends React.Component<ArticleNewNamesProps> {
  render() {
    const { article, relay, numToLoad, hideTitle, title } = this.props;
    if (!article.newNames || article.newNames.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "NewNames"}</h3>}
        <NameList connection={article.newNames} />
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
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
