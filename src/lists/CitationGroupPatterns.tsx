import * as React from "react";

import { CitationGroupPatterns_citationGroup } from "./__generated__/CitationGroupPatterns_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface CitationGroupPatternsProps {
  citationGroup: CitationGroupPatterns_citationGroup;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
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
    const { citationGroup, relay, numToLoad, hideTitle, title } = this.props;
    if (!citationGroup.patterns || citationGroup.patterns.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Patterns"}</h3>}
        <ul>
          {citationGroup.patterns.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                />
              )
          )}
        </ul>
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          expandAll={this.state.expandAll}
          setExpandAll={undefined}
        />
      </>
    );
  }
}

export default createPaginationContainer(
  CitationGroupPatterns,
  {
    citationGroup: graphql`
      fragment CitationGroupPatterns_citationGroup on CitationGroup
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        patterns(first: $count, after: $cursor)
          @connection(key: "CitationGroupPatterns_patterns") {
          edges {
            node {
              oid
              ...ModelListEntry_model
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
  }
);
