import * as React from "react";

import { RegionStratigraphicUnits_region } from "./__generated__/RegionStratigraphicUnits_region.graphql";
import { RegionStratigraphicUnitsChildrenQuery } from "./__generated__/RegionStratigraphicUnitsChildrenQuery.graphql";

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

interface RegionStratigraphicUnitsProps {
  region: RegionStratigraphicUnits_region;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  hideChildren?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class RegionStratigraphicUnits extends React.Component<
  RegionStratigraphicUnitsProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: RegionStratigraphicUnitsProps) {
    super(props);
    this.state = { expandAll: false, showChildren: false };
  }

  render() {
    const {
      region,
      relay,
      numToLoad,
      hideTitle,
      hideChildren,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const { oid, numChildren, chilrenRegionStratigraphicUnits, stratigraphicUnits } =
      region;
    const childrenHaveData = chilrenRegionStratigraphicUnits?.edges.some(
      (edge) => edge && edge.node && edge.node.hasStratigraphicUnits,
    );
    if (
      !stratigraphicUnits ||
      (!childrenHaveData && stratigraphicUnits.edges.length === 0)
    ) {
      return null;
    }
    const showExpandAll = stratigraphicUnits.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && <h3>{title || "StratigraphicUnits"}</h3>}
        {subtitle}
        {childrenHaveData && (
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
        )}
        {this.state.showChildren && (
          <QueryRenderer<RegionStratigraphicUnitsChildrenQuery>
            environment={environment}
            query={graphql`
              query RegionStratigraphicUnitsChildrenQuery($oid: Int!) {
                region(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasStratigraphicUnits
                        ...RegionStratigraphicUnits_region
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
              if (!props || !props.region || !props.region.children) {
                return <div>Loading...</div>;
              }
              const { edges } = props.region.children;
              return (
                <ul>
                  {edges.map(
                    (edge) =>
                      edge &&
                      edge.node &&
                      edge.node.hasStratigraphicUnits && (
                        <li>
                          <ModelLink model={edge.node} />
                          <RegionStratigraphicUnitsContainer
                            region={edge.node}
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
          {stratigraphicUnits.edges.map(
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

const RegionStratigraphicUnitsContainer = createPaginationContainer(
  RegionStratigraphicUnits,
  {
    region: graphql`
      fragment RegionStratigraphicUnits_region on Region
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        chilrenRegionStratigraphicUnits: children(first: 1000) {
          edges {
            node {
              hasStratigraphicUnits
            }
          }
        }
        stratigraphicUnits(first: $count, after: $cursor)
          @connection(key: "RegionStratigraphicUnits_stratigraphicUnits") {
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
    getConnectionFromProps: (props) => props.region.stratigraphicUnits,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionStratigraphicUnitsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionStratigraphicUnits_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);

export default RegionStratigraphicUnitsContainer;
