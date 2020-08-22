import * as React from "react";

import { NameComments_name } from "./__generated__/NameComments_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "../components/ModelLink";

interface NameCommentsProps {
  name: NameComments_name;
  title?: string;
  relay: RelayPaginationProp;
}

class NameComments extends React.Component<
  NameCommentsProps,
  { numToLoad: number }
> {
  constructor(props: NameCommentsProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { name, relay, title } = this.props;
    if (!name.comments || name.comments.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Comments"}</h3>
        <ul>
          {name.comments.edges.map(
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
  NameComments,
  {
    name: graphql`
      fragment NameComments_name on Name
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        comments(first: $count, after: $cursor)
          @connection(key: "NameComments_comments") {
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
    getConnectionFromProps: (props) => props.name.comments,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameCommentsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        name(oid: $oid) {
          ...NameComments_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
