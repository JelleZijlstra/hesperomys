import * as React from "react";

import { PersonArticlesAll_person } from "./__generated__/PersonArticlesAll_person.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface PersonArticlesAllProps {
  person: PersonArticlesAll_person;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class PersonArticlesAll extends React.Component<
  PersonArticlesAllProps,
  { expandAll: boolean }
> {
  constructor(props: PersonArticlesAllProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { person, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Person";
    if (!person.articlesAll || person.articlesAll.edges.length === 0) {
      return null;
    }
    const showExpandAll = person.articlesAll.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "ArticlesAll"} ({person.numArticlesAll})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {person.articlesAll.edges.map(
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
  PersonArticlesAll,
  {
    person: graphql`
      fragment PersonArticlesAll_person on Person
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numArticlesAll
        articlesAll(first: $count, after: $cursor)
          @connection(key: "PersonArticlesAll_articlesAll") {
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
    getConnectionFromProps: (props) => props.person.articlesAll,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.person.oid,
      };
    },
    query: graphql`
      query PersonArticlesAllPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        person(oid: $oid) {
          ...PersonArticlesAll_person @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
