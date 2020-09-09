import * as React from "react";

import { TaxonChildren_taxon } from "./__generated__/TaxonChildren_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface TaxonChildrenProps {
  taxon: TaxonChildren_taxon;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class TaxonChildren extends React.Component<
  TaxonChildrenProps,
  { expandAll: boolean }
> {
  constructor(props: TaxonChildrenProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { taxon, relay, numToLoad, hideTitle, title } = this.props;
    if (!taxon.children || taxon.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = taxon.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Children"}</h3>}
        <ul>
          {taxon.children.edges.map(
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
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
        />
      </>
    );
  }
}

export default createPaginationContainer(
  TaxonChildren,
  {
    taxon: graphql`
      fragment TaxonChildren_taxon on Taxon
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "TaxonChildren_children") {
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
    getConnectionFromProps: (props) => props.taxon.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.taxon.oid,
      };
    },
    query: graphql`
      query TaxonChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        taxon(oid: $oid) {
          ...TaxonChildren_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
