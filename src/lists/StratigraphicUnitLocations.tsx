import * as React from "react";

import { StratigraphicUnitLocations_stratigraphicUnit } from "./__generated__/StratigraphicUnitLocations_stratigraphicUnit.graphql";
import { StratigraphicUnitLocationsChildrenQuery } from "./__generated__/StratigraphicUnitLocationsChildrenQuery.graphql";

import {
  createPaginationContainer,
  RelayPaginationProp,
  QueryRenderer,
} from "react-relay";
import graphql from "babel-plugin-relay/macro";

import environment from "../relayEnvironment";
import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelLink from "../components/ModelLink";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface StratigraphicUnitLocationsProps {
  stratigraphicUnit: StratigraphicUnitLocations_stratigraphicUnit;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  hideChildren?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class StratigraphicUnitLocations extends React.Component<
  StratigraphicUnitLocationsProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: StratigraphicUnitLocationsProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const {
      stratigraphicUnit,
      relay,
      numToLoad,
      hideTitle,
      hideChildren,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const { oid, numChildren, locations } = stratigraphicUnit;
    if (!locations || (numChildren === 0 && locations.edges.length === 0)) {
      return null;
    }
    const showExpandAll = locations.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Locations"} ({numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
          showChildren={this.state.showChildren}
          setShowChildren={
            numChildren > 0 && !hideChildren
              ? (showChildren) => this.setState({ showChildren })
              : undefined
          }
        />
        {this.state.showChildren && (
          <QueryRenderer<StratigraphicUnitLocationsChildrenQuery>
            environment={environment}
            query={graphql`
              query StratigraphicUnitLocationsChildrenQuery($oid: Int!) {
                stratigraphicUnit(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasLocations
                        ...StratigraphicUnitLocations_stratigraphicUnit
                        ...ModelLink_model
                      }
                    }
                  }
                }
              }
            `}
            variables={{ oid }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (
                !props ||
                !props.stratigraphicUnit ||
                !props.stratigraphicUnit.children
              ) {
                return <div>Loading...</div>;
              }
              const { edges } = props.stratigraphicUnit.children;
              return (
                <ul>
                  {edges.map(
                    (edge) =>
                      edge &&
                      edge.node &&
                      edge.node.hasLocations && (
                        <li>
                          <ModelLink model={edge.node} />
                          <StratigraphicUnitLocationsContainer
                            stratigraphicUnit={edge.node}
                            hideTitle
                          />
                        </li>
                      ),
                  )}
                </ul>
              );
            }}
          />
        )}
        <ul>
          {locations.edges.map(
            (edge) =>
              edge &&
              edge.node && (
                <ModelListEntry
                  key={edge.node.oid}
                  model={edge.node}
                  showChildren={this.state.expandAll}
                />
              ),
          )}
        </ul>
        <LoadMoreButton numToLoad={numToLoad} relay={relay} />
      </>
    );
    if (wrapperTitle) {
      return (
        <div>
          <i>{wrapperTitle}</i>
          {inner}
        </div>
      );
    }
    return inner;
  }
}

const StratigraphicUnitLocationsContainer = createPaginationContainer(
  StratigraphicUnitLocations,
  {
    stratigraphicUnit: graphql`
      fragment StratigraphicUnitLocations_stratigraphicUnit on StratigraphicUnit
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        locations(first: $count, after: $cursor)
          @connection(key: "StratigraphicUnitLocations_locations") {
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
    getConnectionFromProps: (props) => props.stratigraphicUnit.locations,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.stratigraphicUnit.oid,
      };
    },
    query: graphql`
      query StratigraphicUnitLocationsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        stratigraphicUnit(oid: $oid) {
          ...StratigraphicUnitLocations_stratigraphicUnit
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);

export default StratigraphicUnitLocationsContainer;
