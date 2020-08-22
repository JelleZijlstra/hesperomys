import * as React from "react";

import { ArticleTypeSourceNames_article } from "./__generated__/ArticleTypeSourceNames_article.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface ArticleTypeSourceNamesProps {
  article: ArticleTypeSourceNames_article;
  title?: string;
  relay: RelayPaginationProp;
}

class ArticleTypeSourceNames extends React.Component<
  ArticleTypeSourceNamesProps,
  { numToLoad: number | null }
> {
  constructor(props: ArticleTypeSourceNamesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { article, relay, title } = this.props;
    if (
      !article.typeSourceNames ||
      article.typeSourceNames.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "TypeSourceNames"}</h3>
        <NameList connection={article.typeSourceNames} />
        {relay.hasMore() && (
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad || ""}
              onChange={(e) => {
                if (!e.target.value) {
                  this.setState({ numToLoad: null });
                  return;
                }
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

    relay.loadMore(this.state.numToLoad || 10, (error) => {
      if (error) {
        console.log(error);
      }
    });
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
