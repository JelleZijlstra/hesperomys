import * as React from "react";

import { CitationGroupArticleSet_citationGroup } from "./__generated__/CitationGroupArticleSet_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface CitationGroupArticleSetProps {
  citationGroup: CitationGroupArticleSet_citationGroup;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class CitationGroupArticleSet extends React.Component<
  CitationGroupArticleSetProps,
  { expandAll: boolean }
> {
  constructor(props: CitationGroupArticleSetProps) {
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
    if (!citationGroup.articleSet || citationGroup.articleSet.edges.length === 0) {
      return null;
    }
    const showExpandAll = citationGroup.articleSet.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    const inner = (
      <>
        {!hideTitle && <h3>{title || "ArticleSet"}</h3>}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {citationGroup.articleSet.edges.map(
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
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
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
  CitationGroupArticleSet,
  {
    citationGroup: graphql`
      fragment CitationGroupArticleSet_citationGroup on CitationGroup
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        articleSet(first: $count, after: $cursor)
          @connection(key: "CitationGroupArticleSet_articleSet") {
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
    getConnectionFromProps: (props) => props.citationGroup.articleSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupArticleSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupArticleSet_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
