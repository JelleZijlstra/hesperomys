import * as React from "react";

import { NameTaxonSet_name } from "./__generated__/NameTaxonSet_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface NameTaxonSetProps {
  name: NameTaxonSet_name;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class NameTaxonSet extends React.Component<NameTaxonSetProps, { expandAll: boolean }> {
  constructor(props: NameTaxonSetProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { name, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!name.taxonSet || name.taxonSet.edges.length === 0) {
      return null;
    }
    const showExpandAll = name.taxonSet.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "TaxonSet"}</h3>}
        {subtitle}
        <ul>
          {name.taxonSet.edges.map(
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
  NameTaxonSet,
  {
    name: graphql`
      fragment NameTaxonSet_name on Name
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        taxonSet(first: $count, after: $cursor)
          @connection(key: "NameTaxonSet_taxonSet") {
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
    getConnectionFromProps: (props) => props.name.taxonSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameTaxonSetPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        name(oid: $oid) {
          ...NameTaxonSet_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
