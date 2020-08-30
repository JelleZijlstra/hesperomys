import * as React from "react";

import { ArticleNameComments_article } from "./__generated__/ArticleNameComments_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface ArticleNameCommentsProps {
  article: ArticleNameComments_article;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class ArticleNameComments extends React.Component<ArticleNameCommentsProps> {
  render() {
    const { article, relay, numToLoad, hideTitle, title } = this.props;
    if (!article.nameComments || article.nameComments.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "NameComments"}</h3>}
        <ul>
          {article.nameComments.edges.map(
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
              ...ModelListEntry_model
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
