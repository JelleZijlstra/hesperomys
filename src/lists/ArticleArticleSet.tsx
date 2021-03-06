import * as React from "react";

import { ArticleArticleSet_article } from "./__generated__/ArticleArticleSet_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface ArticleArticleSetProps {
  article: ArticleArticleSet_article;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class ArticleArticleSet extends React.Component<
  ArticleArticleSetProps,
  { expandAll: boolean }
> {
  constructor(props: ArticleArticleSetProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const {
      article,
      relay,
      numToLoad,
      hideTitle,
      title,
      subtitle,
    } = this.props;
    if (!article.articleSet || article.articleSet.edges.length === 0) {
      return null;
    }
    const showExpandAll = article.articleSet.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "ArticleSet"}</h3>}
        {subtitle}
        <ul>
          {article.articleSet.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                />
              )
          )}
        </ul>
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
      </>
    );
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
              __typename
              ...ModelListEntry_model
              ...ModelChildList_model @relay(mask: false)
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
