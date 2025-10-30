import * as React from "react";

import { CollectionAssociatedPeople_collection } from "./__generated__/CollectionAssociatedPeople_collection.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface CollectionAssociatedPeopleProps {
  collection: CollectionAssociatedPeople_collection;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class CollectionAssociatedPeople extends React.Component<
  CollectionAssociatedPeopleProps,
  { expandAll: boolean }
> {
  constructor(props: CollectionAssociatedPeopleProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { collection, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Collection";
    if (
      !collection.associatedPeople ||
      collection.associatedPeople.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = collection.associatedPeople.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Associated people"} ({collection.numAssociatedPeople})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {collection.associatedPeople.edges.map(
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
  CollectionAssociatedPeople,
  {
    collection: graphql`
      fragment CollectionAssociatedPeople_collection on Collection
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numAssociatedPeople
        associatedPeople(first: $count, after: $cursor)
          @connection(key: "CollectionAssociatedPeople_associatedPeople") {
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
    getConnectionFromProps: (props) => props.collection.associatedPeople,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.collection.oid,
      };
    },
    query: graphql`
      query CollectionAssociatedPeoplePaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        collection(oid: $oid) {
          ...CollectionAssociatedPeople_collection
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
