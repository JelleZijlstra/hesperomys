import * as React from "react";

import { RegionChildren_region } from "./__generated__/RegionChildren_region.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface RegionChildrenProps {
  region: RegionChildren_region;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class RegionChildren extends React.Component<
  RegionChildrenProps,
  { expandAll: boolean }
> {
  constructor(props: RegionChildrenProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { region, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!region.children || region.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = region.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && <h3>{title || "Children"}</h3>}
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
          {region.children.edges.map(
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

export default createPaginationContainer(
  RegionChildren,
  {
    region: graphql`
      fragment RegionChildren_region on Region
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "RegionChildren_children") {
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
    getConnectionFromProps: (props) => props.region.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionChildrenPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        region(oid: $oid) {
          ...RegionChildren_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
