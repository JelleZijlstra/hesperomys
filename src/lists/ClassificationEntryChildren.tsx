import * as React from "react";

import { ClassificationEntryChildren_classificationEntry } from "./__generated__/ClassificationEntryChildren_classificationEntry.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface ClassificationEntryChildrenProps {
  classificationEntry: ClassificationEntryChildren_classificationEntry;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class ClassificationEntryChildren extends React.Component<
  ClassificationEntryChildrenProps,
  { expandAll: boolean }
> {
  constructor(props: ClassificationEntryChildrenProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const {
      classificationEntry,
      relay,
      numToLoad,
      hideTitle,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    if (
      !classificationEntry.children ||
      classificationEntry.children.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = classificationEntry.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Children"} ({classificationEntry.numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {classificationEntry.children.edges.map(
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
  ClassificationEntryChildren,
  {
    classificationEntry: graphql`
      fragment ClassificationEntryChildren_classificationEntry on ClassificationEntry
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        children(first: $count, after: $cursor)
          @connection(key: "ClassificationEntryChildren_children") {
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
    getConnectionFromProps: (props) => props.classificationEntry.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.classificationEntry.oid,
      };
    },
    query: graphql`
      query ClassificationEntryChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        classificationEntry(oid: $oid) {
          ...ClassificationEntryChildren_classificationEntry
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
