import * as React from "react";

import { SpeciesNameComplexEndings_speciesNameComplex } from "./__generated__/SpeciesNameComplexEndings_speciesNameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface SpeciesNameComplexEndingsProps {
  speciesNameComplex: SpeciesNameComplexEndings_speciesNameComplex;
  title?: string;
  relay: RelayPaginationProp;
}

class SpeciesNameComplexEndings extends React.Component<
  SpeciesNameComplexEndingsProps,
  { numToLoad: number }
> {
  constructor(props: SpeciesNameComplexEndingsProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { speciesNameComplex, relay, title } = this.props;
    if (
      !speciesNameComplex.endings ||
      speciesNameComplex.endings.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        <h3>{title || "Endings"}</h3>
        <ul>
          {speciesNameComplex.endings.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <li key={edge.node.oid}>
                  <ModelLink model={edge.node} />
                </li>
              )
          )}
        </ul>
        {relay.hasMore() && (
          <div>
            <button onClick={() => this._loadMore()}>Load</button>{" "}
            <input
              type="text"
              value={this.state.numToLoad}
              onChange={(e) => {
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

    relay.loadMore(this.state.numToLoad, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}

export default createPaginationContainer(
  SpeciesNameComplexEndings,
  {
    speciesNameComplex: graphql`
      fragment SpeciesNameComplexEndings_speciesNameComplex on SpeciesNameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        endings(first: $count, after: $cursor)
          @connection(key: "SpeciesNameComplexEndings_endings") {
          edges {
            node {
              oid
              ...ModelLink_model
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.speciesNameComplex.endings,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.speciesNameComplex.oid,
      };
    },
    query: graphql`
      query SpeciesNameComplexEndingsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        speciesNameComplex(oid: $oid) {
          ...SpeciesNameComplexEndings_speciesNameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
