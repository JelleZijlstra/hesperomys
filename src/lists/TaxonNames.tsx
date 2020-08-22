import * as React from "react";

import { TaxonNames_taxon } from "./__generated__/TaxonNames_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface TaxonNamesProps {
  taxon: TaxonNames_taxon;
  title?: string;
  relay: RelayPaginationProp;
}

class TaxonNames extends React.Component<
  TaxonNamesProps,
  { numToLoad: number | null }
> {
  constructor(props: TaxonNamesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { taxon, relay, title } = this.props;
    if (!taxon.names || taxon.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Names"}</h3>
        <NameList connection={taxon.names} />
        {relay.hasMore() && (
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad || ""}
              onChange={(e) => {
                if (!e.target.value) {
                  this.setState({ numToLoad: null });
                  return;
                }
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  this.setState({ numToLoad: parseInt(e.target.value) });
                }
              }}
            />
            {" More"}
          </div>
        )}
      </>
    );
  }

  _loadMore() {
    const { relay } = this.props;
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }

    relay.loadMore(this.state.numToLoad || 10, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

export default createPaginationContainer(
  TaxonNames,
  {
    taxon: graphql`
      fragment TaxonNames_taxon on Taxon
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "TaxonNames_names") {
          edges {
            node {
              oid
            }
          }
          ...NameList_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.taxon.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.taxon.oid,
      };
    },
    query: graphql`
      query TaxonNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        taxon(oid: $oid) {
          ...TaxonNames_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
