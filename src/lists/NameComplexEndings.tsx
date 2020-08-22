import * as React from "react";

import { NameComplexEndings_nameComplex } from "./__generated__/NameComplexEndings_nameComplex.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface NameComplexEndingsProps {
  nameComplex: NameComplexEndings_nameComplex;
  title?: string;
  relay: RelayPaginationProp;
}

class NameComplexEndings extends React.Component<
  NameComplexEndingsProps,
  { numToLoad: number }
> {
  constructor(props: NameComplexEndingsProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { nameComplex, relay, title } = this.props;
    if (!nameComplex.endings || nameComplex.endings.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Endings"}</h3>
        <ul>
          {nameComplex.endings.edges.map(
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
  NameComplexEndings,
  {
    nameComplex: graphql`
      fragment NameComplexEndings_nameComplex on NameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        endings(first: $count, after: $cursor)
          @connection(key: "NameComplexEndings_endings") {
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
    getConnectionFromProps: (props) => props.nameComplex.endings,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.nameComplex.oid,
      };
    },
    query: graphql`
      query NameComplexEndingsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        nameComplex(oid: $oid) {
          ...NameComplexEndings_nameComplex
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
