import * as React from "react";

import { NameOrderedClassificationEntries_name } from "./__generated__/NameOrderedClassificationEntries_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface NameOrderedClassificationEntriesProps {
  name: NameOrderedClassificationEntries_name;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class NameOrderedClassificationEntries extends React.Component<
  NameOrderedClassificationEntriesProps,
  { expandAll: boolean }
> {
  constructor(props: NameOrderedClassificationEntriesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { name, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Name";
    if (
      !name.orderedClassificationEntries ||
      name.orderedClassificationEntries.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = name.orderedClassificationEntries.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Ordered classification entries"} (
            {name.numOrderedClassificationEntries})
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
          {name.orderedClassificationEntries.edges.map(
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
  NameOrderedClassificationEntries,
  {
    name: graphql`
      fragment NameOrderedClassificationEntries_name on Name
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numOrderedClassificationEntries
        orderedClassificationEntries(first: $count, after: $cursor)
          @connection(
            key: "NameOrderedClassificationEntries_orderedClassificationEntries"
          ) {
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
    getConnectionFromProps: (props) => props.name.orderedClassificationEntries,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameOrderedClassificationEntriesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        name(oid: $oid) {
          ...NameOrderedClassificationEntries_name
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
