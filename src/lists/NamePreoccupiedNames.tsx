import * as React from "react";

import { NamePreoccupiedNames_name } from "./__generated__/NamePreoccupiedNames_name.graphql";
import { NamePreoccupiedNames_nameInner } from "./__generated__/NamePreoccupiedNames_nameInner.graphql";
import { NamePreoccupiedNamesDetailQuery } from "./__generated__/NamePreoccupiedNamesDetailQuery.graphql";

import {
  createPaginationContainer,
  createFragmentContainer,
  QueryRenderer,
  RelayPaginationProp,
} from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";
import environment from "../relayEnvironment";

interface NamePreoccupiedNamesInnerProps {
  nameInner: NamePreoccupiedNames_nameInner;
  title?: string;
  subtitle?: JSX.Element;
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
  wrapperTitle?: string;
}

class NamePreoccupiedNamesInner extends React.Component<NamePreoccupiedNamesInnerProps> {
  render() {
    const {
      nameInner,
      relay,
      numToLoad,
      hideTitle,
      title,
      subtitle,
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
      setShowDetail,
      hideClassification,
      wrapperTitle,
    } = this.props;
    if (!nameInner.preoccupiedNames || nameInner.preoccupiedNames.edges.length === 0) {
      return null;
    }
    const inner = (
      <>
        {!hideTitle && <h3>{title || "PreoccupiedNames"}</h3>}
        {subtitle}
        <ExpandButtons
          showDetail={
            showLocationDetail ||
            showCitationDetail ||
            showCollectionDetail ||
            showEtymologyDetail ||
            showNameDetail
          }
          setShowDetail={setShowDetail}
        />
        <NameList
          connection={nameInner.preoccupiedNames}
          hideClassification={hideClassification}
        />
        <LoadMoreButton numToLoad={numToLoad || 100} relay={relay} />
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

const NamePreoccupiedNamesContainer = createPaginationContainer(
  NamePreoccupiedNamesInner,
  {
    nameInner: graphql`
      fragment NamePreoccupiedNames_nameInner on Name
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
        showLocationDetail: { type: Boolean, defaultValue: false }
        showCitationDetail: { type: Boolean, defaultValue: false }
        showEtymologyDetail: { type: Boolean, defaultValue: false }
        showCollectionDetail: { type: Boolean, defaultValue: false }
        showNameDetail: { type: Boolean, defaultValue: false }
      ) {
        oid
        preoccupiedNames(first: $count, after: $cursor)
          @connection(key: "NamePreoccupiedNames_preoccupiedNames") {
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
    getConnectionFromProps: (props) => props.nameInner.preoccupiedNames,
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
        oid: props.nameInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
        showNameDetail,
      };
    },
    query: graphql`
      query NamePreoccupiedNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
        $showNameDetail: Boolean!
      ) {
        name(oid: $oid) {
          ...NamePreoccupiedNames_nameInner
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
  },
);

interface NamePreoccupiedNamesProps {
  name: NamePreoccupiedNames_name;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  hideClassification?: boolean;
  showLocationDetail?: boolean;
  showCitationDetail?: boolean;
  showCollectionDetail?: boolean;
  showEtymologyDetail?: boolean;
  showNameDetail?: boolean;
  wrapperTitle?: string;
}

class NamePreoccupiedNames extends React.Component<
  NamePreoccupiedNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: NamePreoccupiedNamesProps) {
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

  renderInner(name: Omit<NamePreoccupiedNames_name, "oid" | " $refType">) {
    const { title, hideTitle, numToLoad, hideClassification, subtitle, wrapperTitle } =
      this.props;
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
    } = this.state;
    return (
      <NamePreoccupiedNamesContainer
        nameInner={name}
        title={title}
        subtitle={subtitle}
        hideTitle={hideTitle}
        numToLoad={numToLoad}
        showLocationDetail={showLocationDetail}
        showCitationDetail={showCitationDetail}
        showCollectionDetail={showCollectionDetail}
        showEtymologyDetail={showEtymologyDetail}
        showNameDetail={showNameDetail}
        setShowDetail={undefined}
        hideClassification={hideClassification}
        wrapperTitle={wrapperTitle}
      />
    );
  }

  render() {
    const { name } = this.props;
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
        <QueryRenderer<NamePreoccupiedNamesDetailQuery>
          environment={environment}
          query={graphql`
            query NamePreoccupiedNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
              $showNameDetail: Boolean!
            ) {
              name(oid: $oid) {
                ...NamePreoccupiedNames_nameInner
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
            oid: name.oid,
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
            if (!props || !props.name) {
              return this.renderInner(name);
            }
            return this.renderInner(props.name);
          }}
        />
      );
    }
    return this.renderInner(name);
  }
}

export default createFragmentContainer(NamePreoccupiedNames, {
  name: graphql`
    fragment NamePreoccupiedNames_name on Name
    @argumentDefinitions(
      showLocationDetail: { type: Boolean, defaultValue: false }
      showCitationDetail: { type: Boolean, defaultValue: false }
      showEtymologyDetail: { type: Boolean, defaultValue: false }
      showCollectionDetail: { type: Boolean, defaultValue: false }
      showNameDetail: { type: Boolean, defaultValue: false }
    ) {
      oid
      ...NamePreoccupiedNames_nameInner
        @arguments(
          showLocationDetail: $showLocationDetail
          showCitationDetail: $showCitationDetail
          showCollectionDetail: $showCollectionDetail
          showEtymologyDetail: $showEtymologyDetail
          showNameDetail: $showNameDetail
        )
    }
  `,
});
