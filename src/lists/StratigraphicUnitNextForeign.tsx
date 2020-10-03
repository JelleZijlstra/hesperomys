import * as React from "react";

import { StratigraphicUnitNextForeign_stratigraphicUnit } from "./__generated__/StratigraphicUnitNextForeign_stratigraphicUnit.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface StratigraphicUnitNextForeignProps {
  stratigraphicUnit: StratigraphicUnitNextForeign_stratigraphicUnit;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class StratigraphicUnitNextForeign extends React.Component<
  StratigraphicUnitNextForeignProps,
  { expandAll: boolean }
> {
  constructor(props: StratigraphicUnitNextForeignProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const {
      stratigraphicUnit,
      relay,
      numToLoad,
      hideTitle,
      title,
    } = this.props;
    if (
      !stratigraphicUnit.nextForeign ||
      stratigraphicUnit.nextForeign.edges.length === 0
    ) {
      return null;
    }
    const showExpandAll = stratigraphicUnit.nextForeign.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "NextForeign"}</h3>}
        <ul>
          {stratigraphicUnit.nextForeign.edges.map(
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
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
        />
      </>
    );
  }
}

export default createPaginationContainer(
  StratigraphicUnitNextForeign,
  {
    stratigraphicUnit: graphql`
      fragment StratigraphicUnitNextForeign_stratigraphicUnit on StratigraphicUnit
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        nextForeign(first: $count, after: $cursor)
          @connection(key: "StratigraphicUnitNextForeign_nextForeign") {
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
    getConnectionFromProps: (props) => props.stratigraphicUnit.nextForeign,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.stratigraphicUnit.oid,
      };
    },
    query: graphql`
      query StratigraphicUnitNextForeignPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        stratigraphicUnit(oid: $oid) {
          ...StratigraphicUnitNextForeign_stratigraphicUnit
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
