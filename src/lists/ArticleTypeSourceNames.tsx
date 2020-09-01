import * as React from "react";

import { ArticleTypeSourceNames_article } from "./__generated__/ArticleTypeSourceNames_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";

interface ArticleTypeSourceNamesProps {
  article: ArticleTypeSourceNames_article;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class ArticleTypeSourceNames extends React.Component<
  ArticleTypeSourceNamesProps
> {
  render() {
    const { article, relay, numToLoad, hideTitle, title } = this.props;
    if (
      !article.typeSourceNames ||
      article.typeSourceNames.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "TypeSourceNames"}</h3>}
        <NameList connection={article.typeSourceNames} />
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
      </>
    );
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
            }
          }
          ...NameList_connection
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
