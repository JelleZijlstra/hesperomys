import * as React from "react";

import { LocationTypeLocalities_location } from "./__generated__/LocationTypeLocalities_location.graphql";
import { LocationTypeLocalities_locationInner } from "./__generated__/LocationTypeLocalities_locationInner.graphql";
import { LocationTypeLocalitiesDetailQuery } from "./__generated__/LocationTypeLocalitiesDetailQuery.graphql";

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

interface LocationTypeLocalitiesInnerProps {
  locationInner: LocationTypeLocalities_locationInner;
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

class LocationTypeLocalitiesInner extends React.Component<
  LocationTypeLocalitiesInnerProps
> {
  render() {
    const {
      locationInner,
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
      !locationInner.typeLocalities ||
      locationInner.typeLocalities.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "TypeLocalities"}</h3>}
        <NameList connection={locationInner.typeLocalities} />
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

const LocationTypeLocalitiesContainer = createPaginationContainer(
  LocationTypeLocalitiesInner,
  {
    locationInner: graphql`
      fragment LocationTypeLocalities_locationInner on Location
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
          showLocationDetail: { type: Boolean, defaultValue: false }
          showCitationDetail: { type: Boolean, defaultValue: false }
          showEtymologyDetail: { type: Boolean, defaultValue: false }
          showCollectionDetail: { type: Boolean, defaultValue: false }
        ) {
        oid
        typeLocalities(first: $count, after: $cursor)
          @connection(key: "LocationTypeLocalities_typeLocalities") {
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
    getConnectionFromProps: (props) => props.locationInner.typeLocalities,
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
        oid: props.locationInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
      };
    },
    query: graphql`
      query LocationTypeLocalitiesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
      ) {
        location(oid: $oid) {
          ...LocationTypeLocalities_locationInner
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

interface LocationTypeLocalitiesProps {
  location: LocationTypeLocalities_location;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
}

class LocationTypeLocalities extends React.Component<
  LocationTypeLocalitiesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
  }
> {
  constructor(props: LocationTypeLocalitiesProps) {
    super(props);
    this.state = {
      showLocationDetail: false,
      showCitationDetail: false,
      showCollectionDetail: false,
      showEtymologyDetail: false,
    };
  }

  render() {
    const { location, title, hideTitle, numToLoad } = this.props;
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
        <QueryRenderer<LocationTypeLocalitiesDetailQuery>
          environment={environment}
          query={graphql`
            query LocationTypeLocalitiesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
            ) {
              location(oid: $oid) {
                ...LocationTypeLocalities_locationInner
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
            oid: location.oid,
            showLocationDetail,
            showCitationDetail,
            showCollectionDetail,
            showEtymologyDetail,
          }}
          render={({ error, props }) => {
            if (error) {
              return <div>Failed to load</div>;
            }
            if (!props || !props.location) {
              return <div>Loading...</div>;
            }
            return (
              <LocationTypeLocalitiesContainer
                locationInner={props.location}
                title={title}
                hideTitle={hideTitle}
                numToLoad={numToLoad}
                showLocationDetail={showLocationDetail}
                showCitationDetail={showCitationDetail}
                showCollectionDetail={showCollectionDetail}
                showEtymologyDetail={showEtymologyDetail}
                setShowDetail={(showDetail) =>
                  this.setState({ showLocationDetail: showDetail })
                }
              />
            );
          }}
        />
      );
    }
    return (
      <LocationTypeLocalitiesContainer
        locationInner={location}
        title={title}
        hideTitle={hideTitle}
        numToLoad={numToLoad}
        showLocationDetail={showLocationDetail}
        showCitationDetail={showCitationDetail}
        showCollectionDetail={showCollectionDetail}
        showEtymologyDetail={showEtymologyDetail}
        setShowDetail={(showDetail) =>
          this.setState({ showLocationDetail: showDetail })
        }
      />
    );
  }
}

export default createFragmentContainer(LocationTypeLocalities, {
  location: graphql`
    fragment LocationTypeLocalities_location on Location {
      oid
      ...LocationTypeLocalities_locationInner
    }
  `,
});
