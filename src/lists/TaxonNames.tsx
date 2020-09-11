import * as React from "react";

import { TaxonNames_taxon } from "./__generated__/TaxonNames_taxon.graphql";
import { TaxonNames_taxonInner } from "./__generated__/TaxonNames_taxonInner.graphql";
import { TaxonNamesDetailQuery } from "./__generated__/TaxonNamesDetailQuery.graphql";

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

interface TaxonNamesInnerProps {
  taxonInner: TaxonNames_taxonInner;
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

class TaxonNamesInner extends React.Component<TaxonNamesInnerProps> {
  render() {
    const {
      taxonInner,
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
    if (!taxonInner.names || taxonInner.names.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "Names"}</h3>}
        <NameList
          connection={taxonInner.names}
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

const TaxonNamesContainer = createPaginationContainer(
  TaxonNamesInner,
  {
    taxonInner: graphql`
      fragment TaxonNames_taxonInner on Taxon
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
          @connection(key: "TaxonNames_names") {
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
    getConnectionFromProps: (props) => props.taxonInner.names,
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
        oid: props.taxonInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
        showNameDetail,
      };
    },
    query: graphql`
      query TaxonNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
        $showNameDetail: Boolean!
      ) {
        taxon(oid: $oid) {
          ...TaxonNames_taxonInner
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

interface TaxonNamesProps {
  taxon: TaxonNames_taxon;
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

class TaxonNames extends React.Component<
  TaxonNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: TaxonNamesProps) {
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
      taxon,
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
        <QueryRenderer<TaxonNamesDetailQuery>
          environment={environment}
          query={graphql`
            query TaxonNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
              $showNameDetail: Boolean!
            ) {
              taxon(oid: $oid) {
                ...TaxonNames_taxonInner
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
            oid: taxon.oid,
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
            if (!props || !props.taxon) {
              return <div>Loading...</div>;
            }
            return (
              <TaxonNamesContainer
                taxonInner={props.taxon}
                title={title}
                hideTitle={hideTitle}
                numToLoad={numToLoad}
                showLocationDetail={showLocationDetail}
                showCitationDetail={showCitationDetail}
                showCollectionDetail={showCollectionDetail}
                showEtymologyDetail={showEtymologyDetail}
                showNameDetail={showNameDetail}
                setShowDetail={(showDetail) =>
                  this.setState({ showNameDetail: showDetail })
                }
                hideClassification={hideClassification}
              />
            );
          }}
        />
      );
    }
    return (
      <TaxonNamesContainer
        taxonInner={taxon}
        title={title}
        hideTitle={hideTitle}
        numToLoad={numToLoad}
        showLocationDetail={showLocationDetail}
        showCitationDetail={showCitationDetail}
        showCollectionDetail={showCollectionDetail}
        showEtymologyDetail={showEtymologyDetail}
        showNameDetail={showNameDetail}
        setShowDetail={(showDetail) =>
          this.setState({ showNameDetail: showDetail })
        }
        hideClassification={hideClassification}
      />
    );
  }
}

export default createFragmentContainer(TaxonNames, {
  taxon: graphql`
    fragment TaxonNames_taxon on Taxon {
      oid
      ...TaxonNames_taxonInner
    }
  `,
});
