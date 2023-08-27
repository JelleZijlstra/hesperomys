import * as React from "react";

import { PersonAliases_person } from "./__generated__/PersonAliases_person.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface PersonAliasesProps {
  person: PersonAliases_person;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class PersonAliases extends React.Component<
  PersonAliasesProps,
  { expandAll: boolean }
> {
  constructor(props: PersonAliasesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { person, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!person.aliases || person.aliases.edges.length === 0) {
      return null;
    }
    const showExpandAll = person.aliases.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && <h3>{title || "Aliases"} (person.numAliases)</h3>}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {person.aliases.edges.map(
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
  PersonAliases,
  {
    person: graphql`
      fragment PersonAliases_person on Person
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numAliases
        aliases(first: $count, after: $cursor)
          @connection(key: "PersonAliases_aliases") {
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
    getConnectionFromProps: (props) => props.person.aliases,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.person.oid,
      };
    },
    query: graphql`
      query PersonAliasesPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        person(oid: $oid) {
          ...PersonAliases_person @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
