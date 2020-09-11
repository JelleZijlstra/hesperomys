import * as React from "react";

import { CitationGroupNames_citationGroup } from "./__generated__/CitationGroupNames_citationGroup.graphql";
import { CitationGroupNames_citationGroupInner } from "./__generated__/CitationGroupNames_citationGroupInner.graphql";
import { CitationGroupNamesDetailQuery } from "./__generated__/CitationGroupNamesDetailQuery.graphql";

import {
  createPaginationContainer,
  createFragmentContainer,
  QueryRenderer,
  RelayPaginationProp,
} from "react-relay";
import graphql from "babel-plugin-relay/macro";

import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";
import environment from "../relayEnvironment";

interface CitationGroupNamesInnerProps {
  citationGroupInner: CitationGroupNames_citationGroupInner;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  showLocationDetail: boolean;
  showCitationDetail: boolean;
  showCollectionDetail: boolean;
  showEtymologyDetail: boolean;
  setShowDetail?: (showDetail: boolean) => void;
}

class CitationGroupNamesInner extends React.Component<
  CitationGroupNamesInnerProps
> {
  render() {
    const {
      citationGroupInner,
      relay,
      numToLoad,
      hideTitle,
      title,
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      setShowDetail,
    } = this.props;
    if (
      !citationGroupInner.names ||
      citationGroupInner.names.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Names"}</h3>}
        <NameList connection={citationGroupInner.names} />
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          showDetail={
            showLocationDetail ||
            showCitationDetail ||
            showCollectionDetail ||
            showEtymologyDetail
          }
          setShowDetail={setShowDetail}
        />
      </>
    );
  }
}

const CitationGroupNamesContainer = createPaginationContainer(
  CitationGroupNamesInner,
  {
    citationGroupInner: graphql`
      fragment CitationGroupNames_citationGroupInner on CitationGroup
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
          showLocationDetail: { type: Boolean, defaultValue: false }
          showCitationDetail: { type: Boolean, defaultValue: false }
          showEtymologyDetail: { type: Boolean, defaultValue: false }
          showCollectionDetail: { type: Boolean, defaultValue: false }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "CitationGroupNames_names") {
          edges {
            node {
              oid
            }
          }
          ...NameList_connection
            @arguments(
              showLocationDetail: $showLocationDetail
              showCitationDetail: $showCitationDetail
              showCollectionDetail: $showCollectionDetail
              showEtymologyDetail: $showEtymologyDetail
            )
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.citationGroupInner.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      const {
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
      } = props;
      return {
        count,
        cursor,
        oid: props.citationGroupInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
      };
    },
    query: graphql`
      query CitationGroupNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
      ) {
        citationGroup(oid: $oid) {
          ...CitationGroupNames_citationGroupInner
            @arguments(
              count: $count
              cursor: $cursor
              showLocationDetail: $showLocationDetail
              showCitationDetail: $showCitationDetail
              showCollectionDetail: $showCollectionDetail
              showEtymologyDetail: $showEtymologyDetail
            )
        }
      }
    `,
  }
);

interface CitationGroupNamesProps {
  citationGroup: CitationGroupNames_citationGroup;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
}

class CitationGroupNames extends React.Component<
  CitationGroupNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
  }
> {
  constructor(props: CitationGroupNamesProps) {
    super(props);
    this.state = {
      showLocationDetail: false,
      showCitationDetail: false,
      showCollectionDetail: false,
      showEtymologyDetail: false,
    };
  }

  render() {
    const { citationGroup, title, hideTitle, numToLoad } = this.props;
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
    } = this.state;
    if (
      showLocationDetail ||
      showCitationDetail ||
      showCollectionDetail ||
      showEtymologyDetail
    ) {
      return (
        <QueryRenderer<CitationGroupNamesDetailQuery>
          environment={environment}
          query={graphql`
            query CitationGroupNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
            ) {
              citationGroup(oid: $oid) {
                ...CitationGroupNames_citationGroupInner
                  @arguments(
                    showLocationDetail: $showLocationDetail
                    showCitationDetail: $showCitationDetail
                    showCollectionDetail: $showCollectionDetail
                    showEtymologyDetail: $showEtymologyDetail
                  )
              }
            }
          `}
          variables={{
            oid: citationGroup.oid,
            showLocationDetail,
            showCitationDetail,
            showCollectionDetail,
            showEtymologyDetail,
          }}
          render={({ error, props }) => {
            if (error) {
              return <div>Failed to load</div>;
            }
            if (!props || !props.citationGroup) {
              return <div>Loading...</div>;
            }
            return (
              <CitationGroupNamesContainer
                citationGroupInner={props.citationGroup}
                title={title}
                hideTitle={hideTitle}
                numToLoad={numToLoad}
                showLocationDetail={showLocationDetail}
                showCitationDetail={showCitationDetail}
                showCollectionDetail={showCollectionDetail}
                showEtymologyDetail={showEtymologyDetail}
                setShowDetail={(showDetail) =>
                  this.setState({ showCitationDetail: showDetail })
                }
              />
            );
          }}
        />
      );
    }
    return (
      <CitationGroupNamesContainer
        citationGroupInner={citationGroup}
        title={title}
        hideTitle={hideTitle}
        numToLoad={numToLoad}
        showLocationDetail={showLocationDetail}
        showCitationDetail={showCitationDetail}
        showCollectionDetail={showCollectionDetail}
        showEtymologyDetail={showEtymologyDetail}
        setShowDetail={(showDetail) =>
          this.setState({ showCitationDetail: showDetail })
        }
      />
    );
  }
}

export default createFragmentContainer(CitationGroupNames, {
  citationGroup: graphql`
    fragment CitationGroupNames_citationGroup on CitationGroup {
      oid
      ...CitationGroupNames_citationGroupInner
    }
  `,
});
