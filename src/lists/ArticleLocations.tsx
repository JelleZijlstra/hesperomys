import * as React from "react";

import { ArticleLocations_article } from "./__generated__/ArticleLocations_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface ArticleLocationsProps {
  article: ArticleLocations_article;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class ArticleLocations extends React.Component<
  ArticleLocationsProps,
  { expandAll: boolean }
> {
  constructor(props: ArticleLocationsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { article, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!article.locations || article.locations.edges.length === 0) {
      return null;
    }
    const showExpandAll = article.locations.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Locations"} ({article.numLocations})
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
          {article.locations.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
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
  ArticleLocations,
  {
    article: graphql`
      fragment ArticleLocations_article on Article
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numLocations
        locations(first: $count, after: $cursor)
          @connection(key: "ArticleLocations_locations") {
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
    getConnectionFromProps: (props) => props.article.locations,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.article.oid,
      };
    },
    query: graphql`
      query ArticleLocationsPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        article(oid: $oid) {
          ...ArticleLocations_article @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
