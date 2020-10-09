import * as React from "react";

import { ArticleBiographies_article } from "./__generated__/ArticleBiographies_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface ArticleBiographiesProps {
  article: ArticleBiographies_article;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class ArticleBiographies extends React.Component<
  ArticleBiographiesProps,
  { expandAll: boolean }
> {
  constructor(props: ArticleBiographiesProps) {
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
    if (!article.biographies || article.biographies.edges.length === 0) {
      return null;
    }
    const showExpandAll = article.biographies.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Biographies"}</h3>}
        {subtitle}
        <ul>
          {article.biographies.edges.map(
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
  ArticleBiographies,
  {
    article: graphql`
      fragment ArticleBiographies_article on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        biographies(first: $count, after: $cursor)
          @connection(key: "ArticleBiographies_biographies") {
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
    getConnectionFromProps: (props) => props.article.biographies,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleBiographiesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleBiographies_article
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
