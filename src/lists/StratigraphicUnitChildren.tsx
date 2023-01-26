import * as React from "react";

import { StratigraphicUnitChildren_stratigraphicUnit } from "./__generated__/StratigraphicUnitChildren_stratigraphicUnit.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface StratigraphicUnitChildrenProps {
  stratigraphicUnit: StratigraphicUnitChildren_stratigraphicUnit;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class StratigraphicUnitChildren extends React.Component<
  StratigraphicUnitChildrenProps,
  { expandAll: boolean }
> {
  constructor(props: StratigraphicUnitChildrenProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { stratigraphicUnit, relay, numToLoad, hideTitle, title, subtitle } =
      this.props;
    if (!stratigraphicUnit.children || stratigraphicUnit.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = stratigraphicUnit.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
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
          {stratigraphicUnit.children.edges.map(
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
  StratigraphicUnitChildren,
  {
    stratigraphicUnit: graphql`
      fragment StratigraphicUnitChildren_stratigraphicUnit on StratigraphicUnit
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        children(first: $count, after: $cursor)
          @connection(key: "StratigraphicUnitChildren_children") {
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
    getConnectionFromProps: (props) => props.stratigraphicUnit.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.stratigraphicUnit.oid,
      };
    },
    query: graphql`
      query StratigraphicUnitChildrenPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        stratigraphicUnit(oid: $oid) {
          ...StratigraphicUnitChildren_stratigraphicUnit
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
