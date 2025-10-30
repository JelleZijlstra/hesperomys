import * as React from "react";

import { NameClassificationEntries_name } from "./__generated__/NameClassificationEntries_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface NameClassificationEntriesProps {
  name: NameClassificationEntries_name;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class NameClassificationEntries extends React.Component<
  NameClassificationEntriesProps,
  { expandAll: boolean }
> {
  constructor(props: NameClassificationEntriesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { name, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Name";
    if (!name.classificationEntries || name.classificationEntries.edges.length === 0) {
      return null;
    }
    const showExpandAll = name.classificationEntries.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "ClassificationEntries"} ({name.numClassificationEntries})
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
          {name.classificationEntries.edges.map(
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
  NameClassificationEntries,
  {
    name: graphql`
      fragment NameClassificationEntries_name on Name
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numClassificationEntries
        classificationEntries(first: $count, after: $cursor)
          @connection(key: "NameClassificationEntries_classificationEntries") {
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
    getConnectionFromProps: (props) => props.name.classificationEntries,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameClassificationEntriesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        name(oid: $oid) {
          ...NameClassificationEntries_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
