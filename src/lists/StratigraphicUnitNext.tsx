import * as React from "react";

import { StratigraphicUnitNext_stratigraphicUnit } from "./__generated__/StratigraphicUnitNext_stratigraphicUnit.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface StratigraphicUnitNextProps {
  stratigraphicUnit: StratigraphicUnitNext_stratigraphicUnit;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
}

class StratigraphicUnitNext extends React.Component<
  StratigraphicUnitNextProps,
  { expandAll: boolean }
> {
  constructor(props: StratigraphicUnitNextProps) {
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
    if (!stratigraphicUnit.next || stratigraphicUnit.next.edges.length === 0) {
      return null;
    }
    const showExpandAll = stratigraphicUnit.next.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node)
    );
    return (
      <>
        {!hideTitle && <h3>{title || "Next"}</h3>}
        <ul>
          {stratigraphicUnit.next.edges.map(
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
  StratigraphicUnitNext,
  {
    stratigraphicUnit: graphql`
      fragment StratigraphicUnitNext_stratigraphicUnit on StratigraphicUnit
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
        ) {
        oid
        next(first: $count, after: $cursor)
          @connection(key: "StratigraphicUnitNext_next") {
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
    getConnectionFromProps: (props) => props.stratigraphicUnit.next,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.stratigraphicUnit.oid,
      };
    },
    query: graphql`
      query StratigraphicUnitNextPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        stratigraphicUnit(oid: $oid) {
          ...StratigraphicUnitNext_stratigraphicUnit
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
