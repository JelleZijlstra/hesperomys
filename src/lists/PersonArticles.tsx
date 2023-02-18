import * as React from "react";

import { PersonArticles_person } from "./__generated__/PersonArticles_person.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PersonArticlesProps {
  person: PersonArticles_person;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
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
    const { person, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!person.articles || person.articles.edges.length === 0) {
      return null;
    }
    const showExpandAll = person.articles.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && <h3>{title || "Articles"}</h3>}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
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
  PersonArticles,
  {
    person: graphql`
      fragment PersonArticles_person on Person
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
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
      query PersonArticlesPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        person(oid: $oid) {
          ...PersonArticles_person @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
