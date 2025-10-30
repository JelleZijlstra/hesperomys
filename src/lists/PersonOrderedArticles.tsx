import * as React from "react";

import { PersonOrderedArticles_person } from "./__generated__/PersonOrderedArticles_person.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface PersonOrderedArticlesProps {
  person: PersonOrderedArticles_person;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class PersonOrderedArticles extends React.Component<
  PersonOrderedArticlesProps,
  { expandAll: boolean }
> {
  constructor(props: PersonOrderedArticlesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { person, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Person";
    if (!person.orderedArticles || person.orderedArticles.edges.length === 0) {
      return null;
    }
    const showExpandAll = person.orderedArticles.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Ordered articles"} ({person.numOrderedArticles})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {person.orderedArticles.edges.map(
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
  PersonOrderedArticles,
  {
    person: graphql`
      fragment PersonOrderedArticles_person on Person
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numOrderedArticles
        orderedArticles(first: $count, after: $cursor)
          @connection(key: "PersonOrderedArticles_orderedArticles") {
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
    getConnectionFromProps: (props) => props.person.orderedArticles,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.person.oid,
      };
    },
    query: graphql`
      query PersonOrderedArticlesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        person(oid: $oid) {
          ...PersonOrderedArticles_person @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
