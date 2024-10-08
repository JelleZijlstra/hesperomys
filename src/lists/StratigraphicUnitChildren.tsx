import * as React from "react";

import { StratigraphicUnitChildren_stratigraphicUnit } from "./__generated__/StratigraphicUnitChildren_stratigraphicUnit.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface StratigraphicUnitChildrenProps {
  stratigraphicUnit: StratigraphicUnitChildren_stratigraphicUnit;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
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
    const {
      stratigraphicUnit,
      relay,
      numToLoad,
      hideTitle,
      title,
      subtitle,
      wrapperTitle,
    } = this.props;
    const context = this.props.context || "StratigraphicUnit";
    if (!stratigraphicUnit.children || stratigraphicUnit.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = stratigraphicUnit.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Children"} ({stratigraphicUnit.numChildren})
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
                  context={context}
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
  StratigraphicUnitChildren,
  {
    stratigraphicUnit: graphql`
      fragment StratigraphicUnitChildren_stratigraphicUnit on StratigraphicUnit
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
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
  },
);
