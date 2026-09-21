import * as React from "react";

import { CitationGroupItemFileSet_citationGroup } from "./__generated__/CitationGroupItemFileSet_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface CitationGroupItemFileSetProps {
  citationGroup: CitationGroupItemFileSet_citationGroup;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class CitationGroupItemFileSet extends React.Component<
  CitationGroupItemFileSetProps,
  { expandAll: boolean }
> {
  constructor(props: CitationGroupItemFileSetProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const {
      citationGroup,
      relay,
      numToLoad,
      hideTitle,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const context = this.props.context || "CitationGroup";
    if (!citationGroup.itemFileSet || citationGroup.itemFileSet.edges.length === 0) {
      return null;
    }
    const showExpandAll = citationGroup.itemFileSet.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Item file set"} ({citationGroup.numItemFileSet})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {citationGroup.itemFileSet.edges.map(
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
  CitationGroupItemFileSet,
  {
    citationGroup: graphql`
      fragment CitationGroupItemFileSet_citationGroup on CitationGroup
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numItemFileSet
        itemFileSet(first: $count, after: $cursor)
          @connection(key: "CitationGroupItemFileSet_itemFileSet") {
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
    getConnectionFromProps: (props) => props.citationGroup.itemFileSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupItemFileSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupItemFileSet_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
