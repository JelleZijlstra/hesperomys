import * as React from "react";

import { NameTaxonSet_name } from "./__generated__/NameTaxonSet_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";

interface NameTaxonSetProps {
  name: NameTaxonSet_name;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class NameTaxonSet extends React.Component<NameTaxonSetProps> {
  render() {
    const { name, relay, numToLoad, hideTitle, title } = this.props;
    if (!name.taxonSet || name.taxonSet.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "TaxonSet"}</h3>}
        <ul>
          {name.taxonSet.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry key={edge.node.oid} model={edge.node} />
              )
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad || 10} relay={relay} />
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
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        taxonSet(first: $count, after: $cursor)
          @connection(key: "NameTaxonSet_taxonSet") {
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
    getConnectionFromProps: (props) => props.name.taxonSet,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameTaxonSetPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        name(oid: $oid) {
          ...NameTaxonSet_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
