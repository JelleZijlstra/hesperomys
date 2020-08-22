import * as React from "react";

import { ArticleOccurrences_article } from "./__generated__/ArticleOccurrences_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface ArticleOccurrencesProps {
  article: ArticleOccurrences_article;
  title?: string;
  relay: RelayPaginationProp;
}

class ArticleOccurrences extends React.Component<
  ArticleOccurrencesProps,
  { numToLoad: number }
> {
  constructor(props: ArticleOccurrencesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { article, relay, title } = this.props;
    if (!article.occurrences || article.occurrences.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Occurrences"}</h3>
        <ul>
          {article.occurrences.edges.map(
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
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  this.setState({ numToLoad: parseInt(e.target.value) });
                }
              }}
            />
            {" More"}
          </div>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(this.state.numToLoad, (error) => {
      if (error) {
        console.log(error);
      }
    });
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
              ...ModelLink_model
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
