import * as React from "react";

import { CitationGroupIssueDateSet_citationGroup } from "./__generated__/CitationGroupIssueDateSet_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface CitationGroupIssueDateSetProps {
  citationGroup: CitationGroupIssueDateSet_citationGroup;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class CitationGroupIssueDateSet extends React.Component<
  CitationGroupIssueDateSetProps,
  { expandAll: boolean }
> {
  constructor(props: CitationGroupIssueDateSetProps) {
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
    if (!citationGroup.issueDateSet || citationGroup.issueDateSet.edges.length === 0) {
      return null;
    }
    const showExpandAll = citationGroup.issueDateSet.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "IssueDateSet"} ({citationGroup.numIssueDateSet})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {citationGroup.issueDateSet.edges.map(
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
  CitationGroupIssueDateSet,
  {
    citationGroup: graphql`
      fragment CitationGroupIssueDateSet_citationGroup on CitationGroup
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numIssueDateSet
        issueDateSet(first: $count, after: $cursor)
          @connection(key: "CitationGroupIssueDateSet_issueDateSet") {
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
    getConnectionFromProps: (props) => props.citationGroup.issueDateSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupIssueDateSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupIssueDateSet_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
