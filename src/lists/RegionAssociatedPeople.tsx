import * as React from "react";

import { RegionAssociatedPeople_region } from "./__generated__/RegionAssociatedPeople_region.graphql";
import { RegionAssociatedPeopleChildrenQuery } from "./__generated__/RegionAssociatedPeopleChildrenQuery.graphql";

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

interface RegionAssociatedPeopleProps {
  region: RegionAssociatedPeople_region;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  hideChildren?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

class RegionAssociatedPeople extends React.Component<
  RegionAssociatedPeopleProps,
  { expandAll: boolean; showChildren: boolean }
> {
  constructor(props: RegionAssociatedPeopleProps) {
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
    const { oid, numChildren, associatedPeople } = region;
    if (
      !associatedPeople ||
      (numChildren === 0 && associatedPeople.edges.length === 0)
    ) {
      return null;
    }
    const showExpandAll = associatedPeople.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "AssociatedPeople"} ({numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
          showChildren={this.state.showChildren}
          setShowChildren={
            numChildren > 0 && !hideChildren
              ? (showChildren) => this.setState({ showChildren })
              : undefined
          }
        />
        {this.state.showChildren && (
          <QueryRenderer<RegionAssociatedPeopleChildrenQuery>
            environment={environment}
            query={graphql`
              query RegionAssociatedPeopleChildrenQuery($oid: Int!) {
                region(oid: $oid) {
                  children(first: 1000) {
                    edges {
                      node {
                        hasAssociatedPeople
                        ...RegionAssociatedPeople_region
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
                      edge.node.hasAssociatedPeople && (
                        <li>
                          <ModelLink model={edge.node} />
                          <RegionAssociatedPeopleContainer
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
          {associatedPeople.edges.map(
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

const RegionAssociatedPeopleContainer = createPaginationContainer(
  RegionAssociatedPeople,
  {
    region: graphql`
      fragment RegionAssociatedPeople_region on Region
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        associatedPeople(first: $count, after: $cursor)
          @connection(key: "RegionAssociatedPeople_associatedPeople") {
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
    getConnectionFromProps: (props) => props.region.associatedPeople,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.region.oid,
      };
    },
    query: graphql`
      query RegionAssociatedPeoplePaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
      ) {
        region(oid: $oid) {
          ...RegionAssociatedPeople_region @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);

export default RegionAssociatedPeopleContainer;
