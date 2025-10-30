import * as React from "react";

import { ArticleRootClassificationEntries_article } from "./__generated__/ArticleRootClassificationEntries_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface ArticleRootClassificationEntriesProps {
  article: ArticleRootClassificationEntries_article;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class ArticleRootClassificationEntries extends React.Component<
  ArticleRootClassificationEntriesProps,
  { expandAll: boolean }
> {
  constructor(props: ArticleRootClassificationEntriesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { article, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Article";
    if (
      !article.rootClassificationEntries ||
      article.rootClassificationEntries.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = article.rootClassificationEntries.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "RootClassificationEntries"} (
            {article.numRootClassificationEntries})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
        />
        <ul>
          {article.rootClassificationEntries.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                  context={context}
                />
              ),
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad} relay={relay} />
      </>
    );
    if (wrapperTitle) {
      return (
        <div>
          <i>{wrapperTitle}</i>
          {inner}
        </div>
      );
    }
    return inner;
  }
}

export default createPaginationContainer(
  ArticleRootClassificationEntries,
  {
    article: graphql`
      fragment ArticleRootClassificationEntries_article on Article
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numRootClassificationEntries
        rootClassificationEntries(first: $count, after: $cursor)
          @connection(
            key: "ArticleRootClassificationEntries_rootClassificationEntries"
          ) {
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
    getConnectionFromProps: (props) => props.article.rootClassificationEntries,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleRootClassificationEntriesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        article(oid: $oid) {
          ...ArticleRootClassificationEntries_article
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
