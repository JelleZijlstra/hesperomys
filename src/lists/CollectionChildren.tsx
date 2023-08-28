import * as React from "react";

import { CollectionChildren_collection } from "./__generated__/CollectionChildren_collection.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface CollectionChildrenProps {
  collection: CollectionChildren_collection;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class CollectionChildren extends React.Component<
  CollectionChildrenProps,
  { expandAll: boolean }
> {
  constructor(props: CollectionChildrenProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { collection, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!collection.children || collection.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = collection.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Children"} ({collection.numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
        />
        <ul>
          {collection.children.edges.map(
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
  CollectionChildren,
  {
    collection: graphql`
      fragment CollectionChildren_collection on Collection
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        children(first: $count, after: $cursor)
          @connection(key: "CollectionChildren_children") {
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
    getConnectionFromProps: (props) => props.collection.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.collection.oid,
      };
    },
    query: graphql`
      query CollectionChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        collection(oid: $oid) {
          ...CollectionChildren_collection @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
