import * as React from "react";

import { CitationGroupArticleSet_citationGroup } from "./__generated__/CitationGroupArticleSet_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface CitationGroupArticleSetProps {
  citationGroup: CitationGroupArticleSet_citationGroup;
  title?: string;
  relay: RelayPaginationProp;
}

class CitationGroupArticleSet extends React.Component<
  CitationGroupArticleSetProps,
  { numToLoad: number }
> {
  constructor(props: CitationGroupArticleSetProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { citationGroup, relay, title } = this.props;
    if (
      !citationGroup.articleSet ||
      citationGroup.articleSet.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "ArticleSet"}</h3>
        <ul>
          {citationGroup.articleSet.edges.map(
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
  CitationGroupArticleSet,
  {
    citationGroup: graphql`
      fragment CitationGroupArticleSet_citationGroup on CitationGroup
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        articleSet(first: $count, after: $cursor)
          @connection(key: "CitationGroupArticleSet_articleSet") {
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
    getConnectionFromProps: (props) => props.citationGroup.articleSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupArticleSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupArticleSet_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);