import * as React from "react";

import { PersonBooksAll_person } from "./__generated__/PersonBooksAll_person.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PersonBooksAllProps {
  person: PersonBooksAll_person;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class PersonBooksAll extends React.Component<
  PersonBooksAllProps,
  { expandAll: boolean }
> {
  constructor(props: PersonBooksAllProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { person, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!person.booksAll || person.booksAll.edges.length === 0) {
      return null;
    }
    const showExpandAll = person.booksAll.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "BooksAll"} ({person.numBooksAll})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {person.booksAll.edges.map(
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
  PersonBooksAll,
  {
    person: graphql`
      fragment PersonBooksAll_person on Person
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numBooksAll
        booksAll(first: $count, after: $cursor)
          @connection(key: "PersonBooksAll_booksAll") {
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
    getConnectionFromProps: (props) => props.person.booksAll,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.person.oid,
      };
    },
    query: graphql`
      query PersonBooksAllPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        person(oid: $oid) {
          ...PersonBooksAll_person @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
