import * as React from "react";

import { SpeciesNameComplexNames_speciesNameComplex } from "./__generated__/SpeciesNameComplexNames_speciesNameComplex.graphql";
import { SpeciesNameComplexNames_speciesNameComplexInner } from "./__generated__/SpeciesNameComplexNames_speciesNameComplexInner.graphql";
import { SpeciesNameComplexNamesDetailQuery } from "./__generated__/SpeciesNameComplexNamesDetailQuery.graphql";

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

interface SpeciesNameComplexNamesInnerProps {
  speciesNameComplexInner: SpeciesNameComplexNames_speciesNameComplexInner;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  showLocationDetail: boolean;
  showCitationDetail: boolean;
  showCollectionDetail: boolean;
  showEtymologyDetail: boolean;
  showNameDetail: boolean;
  setShowDetail?: (showDetail: boolean) => void;
  hideClassification?: boolean;
}

class SpeciesNameComplexNamesInner extends React.Component<
  SpeciesNameComplexNamesInnerProps
> {
  render() {
    const {
      speciesNameComplexInner,
      relay,
      numToLoad,
      hideTitle,
      title,
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
      setShowDetail,
      hideClassification,
    } = this.props;
    if (
      !speciesNameComplexInner.names ||
      speciesNameComplexInner.names.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Names"}</h3>}
        <NameList
          connection={speciesNameComplexInner.names}
          hideClassification={hideClassification}
        />
        <LoadMoreButton
          numToLoad={numToLoad || 100}
          relay={relay}
          showDetail={
            showLocationDetail ||
            showCitationDetail ||
            showCollectionDetail ||
            showEtymologyDetail ||
            showNameDetail
          }
          setShowDetail={setShowDetail}
        />
      </>
    );
  }
}

const SpeciesNameComplexNamesContainer = createPaginationContainer(
  SpeciesNameComplexNamesInner,
  {
    speciesNameComplexInner: graphql`
      fragment SpeciesNameComplexNames_speciesNameComplexInner on SpeciesNameComplex
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
          showLocationDetail: { type: Boolean, defaultValue: false }
          showCitationDetail: { type: Boolean, defaultValue: false }
          showEtymologyDetail: { type: Boolean, defaultValue: false }
          showCollectionDetail: { type: Boolean, defaultValue: false }
          showNameDetail: { type: Boolean, defaultValue: false }
        ) {
        oid
        names(first: $count, after: $cursor)
          @connection(key: "SpeciesNameComplexNames_names") {
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
              showNameDetail: $showNameDetail
            )
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.speciesNameComplexInner.names,
    getVariables(props, { count, cursor }, fragmentVariables) {
      const {
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
        showNameDetail,
      } = props;
      return {
        count,
        cursor,
        oid: props.speciesNameComplexInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
        showNameDetail,
      };
    },
    query: graphql`
      query SpeciesNameComplexNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
        $showNameDetail: Boolean!
      ) {
        speciesNameComplex(oid: $oid) {
          ...SpeciesNameComplexNames_speciesNameComplexInner
            @arguments(
              count: $count
              cursor: $cursor
              showLocationDetail: $showLocationDetail
              showCitationDetail: $showCitationDetail
              showCollectionDetail: $showCollectionDetail
              showEtymologyDetail: $showEtymologyDetail
              showNameDetail: $showNameDetail
            )
        }
      }
    `,
  }
);

interface SpeciesNameComplexNamesProps {
  speciesNameComplex: SpeciesNameComplexNames_speciesNameComplex;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
  hideClassification?: boolean;
  showLocationDetail?: boolean;
  showCitationDetail?: boolean;
  showCollectionDetail?: boolean;
  showEtymologyDetail?: boolean;
  showNameDetail?: boolean;
}

class SpeciesNameComplexNames extends React.Component<
  SpeciesNameComplexNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: SpeciesNameComplexNamesProps) {
    super(props);
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
    } = props;
    this.state = {
      showLocationDetail: showLocationDetail ?? false,
      showCitationDetail: showCitationDetail ?? false,
      showCollectionDetail: showCollectionDetail ?? false,
      showEtymologyDetail: showEtymologyDetail ?? false,
      showNameDetail: showNameDetail ?? false,
    };
  }

  render() {
    const {
      speciesNameComplex,
      title,
      hideTitle,
      numToLoad,
      hideClassification,
    } = this.props;
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
    } = this.state;
    if (
      showLocationDetail ||
      showCitationDetail ||
      showCollectionDetail ||
      showEtymologyDetail ||
      showNameDetail
    ) {
      return (
        <QueryRenderer<SpeciesNameComplexNamesDetailQuery>
          environment={environment}
          query={graphql`
            query SpeciesNameComplexNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
              $showNameDetail: Boolean!
            ) {
              speciesNameComplex(oid: $oid) {
                ...SpeciesNameComplexNames_speciesNameComplexInner
                  @arguments(
                    showLocationDetail: $showLocationDetail
                    showCitationDetail: $showCitationDetail
                    showCollectionDetail: $showCollectionDetail
                    showEtymologyDetail: $showEtymologyDetail
                    showNameDetail: $showNameDetail
                  )
              }
            }
          `}
          variables={{
            oid: speciesNameComplex.oid,
            showLocationDetail,
            showCitationDetail,
            showCollectionDetail,
            showEtymologyDetail,
            showNameDetail,
          }}
          render={({ error, props }) => {
            if (error) {
              return <div>Failed to load</div>;
            }
            if (!props || !props.speciesNameComplex) {
              return <div>Loading...</div>;
            }
            return (
              <SpeciesNameComplexNamesContainer
                speciesNameComplexInner={props.speciesNameComplex}
                title={title}
                hideTitle={hideTitle}
                numToLoad={numToLoad}
                showLocationDetail={showLocationDetail}
                showCitationDetail={showCitationDetail}
                showCollectionDetail={showCollectionDetail}
                showEtymologyDetail={showEtymologyDetail}
                showNameDetail={showNameDetail}
                setShowDetail={(showDetail) =>
                  this.setState({ showEtymologyDetail: showDetail })
                }
                hideClassification={hideClassification}
              />
            );
          }}
        />
      );
    }
    return (
      <SpeciesNameComplexNamesContainer
        speciesNameComplexInner={speciesNameComplex}
        title={title}
        hideTitle={hideTitle}
        numToLoad={numToLoad}
        showLocationDetail={showLocationDetail}
        showCitationDetail={showCitationDetail}
        showCollectionDetail={showCollectionDetail}
        showEtymologyDetail={showEtymologyDetail}
        showNameDetail={showNameDetail}
        setShowDetail={(showDetail) =>
          this.setState({ showEtymologyDetail: showDetail })
        }
        hideClassification={hideClassification}
      />
    );
  }
}

export default createFragmentContainer(SpeciesNameComplexNames, {
  speciesNameComplex: graphql`
    fragment SpeciesNameComplexNames_speciesNameComplex on SpeciesNameComplex {
      oid
      ...SpeciesNameComplexNames_speciesNameComplexInner
    }
  `,
});
