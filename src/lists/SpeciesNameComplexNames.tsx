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
  setShowDetail?: (showDetail: boolean) => void;
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
      setShowDetail,
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
        <NameList connection={speciesNameComplexInner.names} />
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
      } = props;
      return {
        count,
        cursor,
        oid: props.speciesNameComplexInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
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
}

class SpeciesNameComplexNames extends React.Component<
  SpeciesNameComplexNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
  }
> {
  constructor(props: SpeciesNameComplexNamesProps) {
    super(props);
    this.state = {
      showLocationDetail: false,
      showCitationDetail: false,
      showCollectionDetail: false,
      showEtymologyDetail: false,
    };
  }

  render() {
    const { speciesNameComplex, title, hideTitle, numToLoad } = this.props;
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
        <QueryRenderer<SpeciesNameComplexNamesDetailQuery>
          environment={environment}
          query={graphql`
            query SpeciesNameComplexNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
            ) {
              speciesNameComplex(oid: $oid) {
                ...SpeciesNameComplexNames_speciesNameComplexInner
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
            oid: speciesNameComplex.oid,
            showLocationDetail,
            showCitationDetail,
            showCollectionDetail,
            showEtymologyDetail,
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
                setShowDetail={(showDetail) =>
                  this.setState({ showEtymologyDetail: showDetail })
                }
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
        setShowDetail={(showDetail) =>
          this.setState({ showEtymologyDetail: showDetail })
        }
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
