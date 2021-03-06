import * as React from "react";

import { LocationTaxa_location } from "./__generated__/LocationTaxa_location.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface LocationTaxaProps {
  location: LocationTaxa_location;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class LocationTaxa extends React.Component<
  LocationTaxaProps,
  { expandAll: boolean }
> {
  constructor(props: LocationTaxaProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const {
      location,
      relay,
      numToLoad,
      hideTitle,
      title,
      subtitle,
    } = this.props;
    if (!location.taxa || location.taxa.edges.length === 0) {
      return null;
    }
    const showExpandAll = location.taxa.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Taxa"}</h3>}
        {subtitle}
        <ul>
          {location.taxa.edges.map(
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
          setExpandAll={showExpandAll ? undefined : undefined}
        />
      </>
    );
  }
}

export default createPaginationContainer(
  LocationTaxa,
  {
    location: graphql`
      fragment LocationTaxa_location on Location
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        taxa(first: $count, after: $cursor)
          @connection(key: "LocationTaxa_taxa") {
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
    getConnectionFromProps: (props) => props.location.taxa,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.location.oid,
      };
    },
    query: graphql`
      query LocationTaxaPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        location(oid: $oid) {
          ...LocationTaxa_location @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
