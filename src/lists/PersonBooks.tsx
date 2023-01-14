import * as React from "react";

import { PersonBooks_person } from "./__generated__/PersonBooks_person.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PersonBooksProps {
  person: PersonBooks_person;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class PersonBooks extends React.Component<
  PersonBooksProps,
  { expandAll: boolean }
> {
  constructor(props: PersonBooksProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { person, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!person.books || person.books.edges.length === 0) {
      return null;
    }
    const showExpandAll = person.books.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Books"}</h3>}
        {subtitle}
        <ul>
          {person.books.edges.map(
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
  PersonBooks,
  {
    person: graphql`
      fragment PersonBooks_person on Person
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        books(first: $count, after: $cursor)
          @connection(key: "PersonBooks_books") {
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
    getConnectionFromProps: (props) => props.person.books,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.person.oid,
      };
    },
    query: graphql`
      query PersonBooksPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        person(oid: $oid) {
          ...PersonBooks_person @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);