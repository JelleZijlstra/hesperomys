import * as React from "react";

import { ArticleCollectionDetails_article } from "./__generated__/ArticleCollectionDetails_article.graphql";
import { ArticleCollectionDetails_articleInner } from "./__generated__/ArticleCollectionDetails_articleInner.graphql";
import { ArticleCollectionDetailsDetailQuery } from "./__generated__/ArticleCollectionDetailsDetailQuery.graphql";

import {
  createPaginationContainer,
  createFragmentContainer,
  QueryRenderer,
  RelayPaginationProp,
} from "react-relay";
import graphql from "babel-plugin-relay/macro";

import { Context } from "../components/ModelLink";
import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import NameList from "../components/NameList";
import environment from "../relayEnvironment";

interface ArticleCollectionDetailsInnerProps {
  articleInner: ArticleCollectionDetails_articleInner;
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
  groupVariants?: boolean;
  wrapperTitle?: string;
  context?: Context;
}

class ArticleCollectionDetailsInner extends React.Component<ArticleCollectionDetailsInnerProps> {
  render() {
    const {
      articleInner,
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
      groupVariants,
      wrapperTitle,
      context,
    } = this.props;
    if (
      !articleInner.collectionDetails ||
      articleInner.collectionDetails.edges.length === 0
    ) {
      return null;
    }
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "CollectionDetails"} ({articleInner.numCollectionDetails})
          </h3>
        )}
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
          connection={articleInner.collectionDetails}
          hideClassification={hideClassification}
          groupVariants={groupVariants}
          context={context}
        />
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

const ArticleCollectionDetailsContainer = createPaginationContainer(
  ArticleCollectionDetailsInner,
  {
    articleInner: graphql`
      fragment ArticleCollectionDetails_articleInner on Article
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
        numCollectionDetails
        collectionDetails(first: $count, after: $cursor)
          @connection(key: "ArticleCollectionDetails_collectionDetails") {
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
    getConnectionFromProps: (props) => props.articleInner.collectionDetails,
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
      query ArticleCollectionDetailsPaginationQuery(
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
          ...ArticleCollectionDetails_articleInner
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

interface ArticleCollectionDetailsProps {
  article: ArticleCollectionDetails_article;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  hideClassification?: boolean;
  groupVariants?: boolean;
  showLocationDetail?: boolean;
  showCitationDetail?: boolean;
  showCollectionDetail?: boolean;
  showEtymologyDetail?: boolean;
  showNameDetail?: boolean;
  wrapperTitle?: string;
  context?: Context;
}

class ArticleCollectionDetails extends React.Component<
  ArticleCollectionDetailsProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: ArticleCollectionDetailsProps) {
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

  renderInner(article: Omit<ArticleCollectionDetails_article, "oid" | " $refType">) {
    const {
      title,
      hideTitle,
      numToLoad,
      hideClassification,
      groupVariants,
      subtitle,
      wrapperTitle,
    } = this.props;
    const context = this.props.context || "Article";
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
    } = this.state;
    return (
      <ArticleCollectionDetailsContainer
        articleInner={article}
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
        groupVariants={groupVariants}
        wrapperTitle={wrapperTitle}
        context={context}
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
        <QueryRenderer<ArticleCollectionDetailsDetailQuery>
          environment={environment}
          query={graphql`
            query ArticleCollectionDetailsDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
              $showNameDetail: Boolean!
            ) {
              article(oid: $oid) {
                ...ArticleCollectionDetails_articleInner
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

export default createFragmentContainer(ArticleCollectionDetails, {
  article: graphql`
    fragment ArticleCollectionDetails_article on Article
    @argumentDefinitions(
      showLocationDetail: { type: Boolean, defaultValue: false }
      showCitationDetail: { type: Boolean, defaultValue: false }
      showEtymologyDetail: { type: Boolean, defaultValue: false }
      showCollectionDetail: { type: Boolean, defaultValue: false }
      showNameDetail: { type: Boolean, defaultValue: false }
    ) {
      oid
      ...ArticleCollectionDetails_articleInner
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
