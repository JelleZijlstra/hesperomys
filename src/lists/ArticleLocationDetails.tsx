import * as React from "react";

import { ArticleLocationDetails_article } from "./__generated__/ArticleLocationDetails_article.graphql";
import { ArticleLocationDetails_articleInner } from "./__generated__/ArticleLocationDetails_articleInner.graphql";
import { ArticleLocationDetailsDetailQuery } from "./__generated__/ArticleLocationDetailsDetailQuery.graphql";

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

interface ArticleLocationDetailsInnerProps {
  articleInner: ArticleLocationDetails_articleInner;
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

class ArticleLocationDetailsInner extends React.Component<
  ArticleLocationDetailsInnerProps
> {
  render() {
    const {
      articleInner,
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
      !articleInner.locationDetails ||
      articleInner.locationDetails.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "LocationDetails"}</h3>}
        <NameList
          connection={articleInner.locationDetails}
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

const ArticleLocationDetailsContainer = createPaginationContainer(
  ArticleLocationDetailsInner,
  {
    articleInner: graphql`
      fragment ArticleLocationDetails_articleInner on Article
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
        locationDetails(first: $count, after: $cursor)
          @connection(key: "ArticleLocationDetails_locationDetails") {
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
    getConnectionFromProps: (props) => props.articleInner.locationDetails,
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
        oid: props.articleInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
        showNameDetail,
      };
    },
    query: graphql`
      query ArticleLocationDetailsPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
        $showNameDetail: Boolean!
      ) {
        article(oid: $oid) {
          ...ArticleLocationDetails_articleInner
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

interface ArticleLocationDetailsProps {
  article: ArticleLocationDetails_article;
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

class ArticleLocationDetails extends React.Component<
  ArticleLocationDetailsProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: ArticleLocationDetailsProps) {
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

  renderInner(
    article: Omit<ArticleLocationDetails_article, "oid" | " $refType">
  ) {
    const { title, hideTitle, numToLoad, hideClassification } = this.props;
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
    } = this.state;
    return (
      <ArticleLocationDetailsContainer
        articleInner={article}
        title={title}
        hideTitle={hideTitle}
        numToLoad={numToLoad}
        showLocationDetail={showLocationDetail}
        showCitationDetail={showCitationDetail}
        showCollectionDetail={showCollectionDetail}
        showEtymologyDetail={showEtymologyDetail}
        showNameDetail={showNameDetail}
        setShowDetail={undefined}
        hideClassification={hideClassification}
      />
    );
  }

  render() {
    const { article } = this.props;
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
        <QueryRenderer<ArticleLocationDetailsDetailQuery>
          environment={environment}
          query={graphql`
            query ArticleLocationDetailsDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
              $showNameDetail: Boolean!
            ) {
              article(oid: $oid) {
                ...ArticleLocationDetails_articleInner
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
            oid: article.oid,
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
            if (!props || !props.article) {
              return this.renderInner(article);
            }
            return this.renderInner(props.article);
          }}
        />
      );
    }
    return this.renderInner(article);
  }
}

export default createFragmentContainer(ArticleLocationDetails, {
  article: graphql`
    fragment ArticleLocationDetails_article on Article
      @argumentDefinitions(
        showLocationDetail: { type: Boolean, defaultValue: false }
        showCitationDetail: { type: Boolean, defaultValue: false }
        showEtymologyDetail: { type: Boolean, defaultValue: false }
        showCollectionDetail: { type: Boolean, defaultValue: false }
        showNameDetail: { type: Boolean, defaultValue: false }
      ) {
      oid
      ...ArticleLocationDetails_articleInner
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
