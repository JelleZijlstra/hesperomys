import * as React from "react";

import { NameComments_name } from "./__generated__/NameComments_name.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { Context } from "../components/ModelLink";
import { supportsChildren } from "../components/ModelChildList";

interface NameCommentsProps {
  name: NameComments_name;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
  context?: Context;
}

class NameComments extends React.Component<NameCommentsProps, { expandAll: boolean }> {
  constructor(props: NameCommentsProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { name, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Name";
    if (!name.comments || name.comments.edges.length === 0) {
      return null;
    }
    const showExpandAll = name.comments.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Comments"} ({name.numComments})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={showExpandAll ? undefined : undefined}
        />
        <ul>
          {name.comments.edges.map(
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
  NameComments,
  {
    name: graphql`
      fragment NameComments_name on Name
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numComments
        comments(first: $count, after: $cursor)
          @connection(key: "NameComments_comments") {
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
    getConnectionFromProps: (props) => props.name.comments,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.name.oid,
      };
    },
    query: graphql`
      query NameCommentsPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        name(oid: $oid) {
          ...NameComments_name @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
