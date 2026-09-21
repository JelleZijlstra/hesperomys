import * as React from "react";

import { ClassificationEntryOccurrenceRecords_classificationEntry } from "./__generated__/ClassificationEntryOccurrenceRecords_classificationEntry.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface ClassificationEntryOccurrenceRecordsProps {
  classificationEntry: ClassificationEntryOccurrenceRecords_classificationEntry;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class ClassificationEntryOccurrenceRecords extends React.Component<
  ClassificationEntryOccurrenceRecordsProps,
  { expandAll: boolean }
> {
  constructor(props: ClassificationEntryOccurrenceRecordsProps) {
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
    const context = this.props.context || "ClassificationEntry";
    if (
      !classificationEntry.occurrenceRecords ||
      classificationEntry.occurrenceRecords.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = classificationEntry.occurrenceRecords.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Occurrence records"} ({classificationEntry.numOccurrenceRecords})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {classificationEntry.occurrenceRecords.edges.map(
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
  ClassificationEntryOccurrenceRecords,
  {
    classificationEntry: graphql`
      fragment ClassificationEntryOccurrenceRecords_classificationEntry on ClassificationEntry
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numOccurrenceRecords
        occurrenceRecords(first: $count, after: $cursor)
          @connection(key: "ClassificationEntryOccurrenceRecords_occurrenceRecords") {
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
    getConnectionFromProps: (props) => props.classificationEntry.occurrenceRecords,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.classificationEntry.oid,
      };
    },
    query: graphql`
      query ClassificationEntryOccurrenceRecordsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        classificationEntry(oid: $oid) {
          ...ClassificationEntryOccurrenceRecords_classificationEntry
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
