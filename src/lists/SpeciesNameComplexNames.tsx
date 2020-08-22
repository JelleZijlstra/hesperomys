import * as React from "react";

import { SpeciesNameComplexNames_speciesNameComplex } from "./__generated__/SpeciesNameComplexNames_speciesNameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface SpeciesNameComplexNamesProps {
  speciesNameComplex: SpeciesNameComplexNames_speciesNameComplex;
  title?: string;
  relay: RelayPaginationProp;
}

class SpeciesNameComplexNames extends React.Component<
  SpeciesNameComplexNamesProps,
  { numToLoad: number | null }
> {
  constructor(props: SpeciesNameComplexNamesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { speciesNameComplex, relay, title } = this.props;
    if (
      !speciesNameComplex.names ||
      speciesNameComplex.names.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "Names"}</h3>
        <NameList connection={speciesNameComplex.names} />
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
  SpeciesNameComplexNames,
  {
    speciesNameComplex: graphql`
      fragment SpeciesNameComplexNames_speciesNameComplex on SpeciesNameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "SpeciesNameComplexNames_names") {
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
    getConnectionFromProps: (props) => props.speciesNameComplex.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.speciesNameComplex.oid,
      };
    },
    query: graphql`
      query SpeciesNameComplexNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        speciesNameComplex(oid: $oid) {
          ...SpeciesNameComplexNames_speciesNameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
