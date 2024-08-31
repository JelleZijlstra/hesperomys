import * as React from "react";

import { CitationGroupPatterns_citationGroup } from "./__generated__/CitationGroupPatterns_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface CitationGroupPatternsProps {
  citationGroup: CitationGroupPatterns_citationGroup;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class CitationGroupPatterns extends React.Component<
  CitationGroupPatternsProps,
  { expandAll: boolean }
> {
  constructor(props: CitationGroupPatternsProps) {
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
    if (!citationGroup.patterns || citationGroup.patterns.edges.length === 0) {
      return null;
    }
    const showExpandAll = citationGroup.patterns.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Patterns"} ({citationGroup.numPatterns})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {citationGroup.patterns.edges.map(
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
  CitationGroupPatterns,
  {
    citationGroup: graphql`
      fragment CitationGroupPatterns_citationGroup on CitationGroup
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numPatterns
        patterns(first: $count, after: $cursor)
          @connection(key: "CitationGroupPatterns_patterns") {
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
    getConnectionFromProps: (props) => props.citationGroup.patterns,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupPatternsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupPatterns_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
