import * as React from "react";

import { PersonArticles_person } from "./__generated__/PersonArticles_person.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PersonArticlesProps {
  person: PersonArticles_person;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PersonArticles extends React.Component<
  PersonArticlesProps,
  { expandAll: boolean }
> {
  constructor(props: PersonArticlesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { person, relay, numToLoad, hideTitle, title } = this.props;
    if (!person.articles || person.articles.edges.length === 0) {
      return null;
    }
    const showExpandAll = person.articles.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Articles"}</h3>}
        <ul>
          {person.articles.edges.map(
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
  PersonArticles,
  {
    person: graphql`
      fragment PersonArticles_person on Person
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        articles(first: $count, after: $cursor)
          @connection(key: "PersonArticles_articles") {
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
    getConnectionFromProps: (props) => props.person.articles,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.person.oid,
      };
    },
    query: graphql`
      query PersonArticlesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        person(oid: $oid) {
          ...PersonArticles_person @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
