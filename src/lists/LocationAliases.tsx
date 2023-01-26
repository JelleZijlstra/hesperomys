import * as React from "react";

import { LocationAliases_location } from "./__generated__/LocationAliases_location.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface LocationAliasesProps {
  location: LocationAliases_location;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class LocationAliases extends React.Component<
  LocationAliasesProps,
  { expandAll: boolean }
> {
  constructor(props: LocationAliasesProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { location, relay, numToLoad, hideTitle, title, subtitle } = this.props;
    if (!location.aliases || location.aliases.edges.length === 0) {
      return null;
    }
    const showExpandAll = location.aliases.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Aliases"}</h3>}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
        />
        <ul>
          {location.aliases.edges.map(
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
  }
}

export default createPaginationContainer(
  LocationAliases,
  {
    location: graphql`
      fragment LocationAliases_location on Location
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        aliases(first: $count, after: $cursor)
          @connection(key: "LocationAliases_aliases") {
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
    getConnectionFromProps: (props) => props.location.aliases,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.location.oid,
      };
    },
    query: graphql`
      query LocationAliasesPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        location(oid: $oid) {
          ...LocationAliases_location @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
