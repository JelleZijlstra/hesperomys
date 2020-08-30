import * as React from "react";

import { ArticleOccurrences_article } from "./__generated__/ArticleOccurrences_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface ArticleOccurrencesProps {
  article: ArticleOccurrences_article;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class ArticleOccurrences extends React.Component<ArticleOccurrencesProps> {
  render() {
    const { article, relay, numToLoad, hideTitle, title } = this.props;
    if (!article.occurrences || article.occurrences.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Occurrences"}</h3>}
        <ul>
          {article.occurrences.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
      </>
    );
  }
}

export default createPaginationContainer(
  ArticleOccurrences,
  {
    article: graphql`
      fragment ArticleOccurrences_article on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        occurrences(first: $count, after: $cursor)
          @connection(key: "ArticleOccurrences_occurrences") {
          edges {
            node {
              oid
              ...ModelListEntry_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.article.occurrences,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleOccurrencesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleOccurrences_article
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
