import * as React from "react";

import { CitationGroupNames_citationGroup } from "./__generated__/CitationGroupNames_citationGroup.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import NameList from "../components/NameList";

interface CitationGroupNamesProps {
  citationGroup: CitationGroupNames_citationGroup;
  title?: string;
  relay: RelayPaginationProp;
}

class CitationGroupNames extends React.Component<
  CitationGroupNamesProps,
  { numToLoad: number | null }
> {
  constructor(props: CitationGroupNamesProps) {
    super(props);
    this.state = { numToLoad: 10 };
  }

  render() {
    const { citationGroup, relay, title } = this.props;
    if (!citationGroup.names || citationGroup.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        <h3>{title || "Names"}</h3>
        <NameList connection={citationGroup.names} />
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
  CitationGroupNames,
  {
    citationGroup: graphql`
      fragment CitationGroupNames_citationGroup on CitationGroup
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "CitationGroupNames_names") {
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
    getConnectionFromProps: (props) => props.citationGroup.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.citationGroup.oid,
      };
    },
    query: graphql`
      query CitationGroupNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupNames_citationGroup
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
