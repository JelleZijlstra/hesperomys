import * as React from "react";

import { ArticleLocations_article } from "./__generated__/ArticleLocations_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface ArticleLocationsProps {
  article: ArticleLocations_article;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
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
    const { article, relay, numToLoad, hideTitle, title } = this.props;
    if (!article.locations || article.locations.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Locations"}</h3>}
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
              )
          )}
        </ul>
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={(expandAll: boolean) => this.setState({ expandAll })}
        />
      </>
    );
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
              ...ModelListEntry_model
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
