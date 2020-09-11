import * as React from "react";

import { ArticleNewNames_article } from "./__generated__/ArticleNewNames_article.graphql";
import { ArticleNewNames_articleInner } from "./__generated__/ArticleNewNames_articleInner.graphql";
import { ArticleNewNamesDetailQuery } from "./__generated__/ArticleNewNamesDetailQuery.graphql";

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

interface ArticleNewNamesInnerProps {
  articleInner: ArticleNewNames_articleInner;
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

class ArticleNewNamesInner extends React.Component<ArticleNewNamesInnerProps> {
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
      setShowDetail,
    } = this.props;
    if (!articleInner.newNames || articleInner.newNames.edges.length === 0) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "NewNames"}</h3>}
        <NameList connection={articleInner.newNames} />
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

const ArticleNewNamesContainer = createPaginationContainer(
  ArticleNewNamesInner,
  {
    articleInner: graphql`
      fragment ArticleNewNames_articleInner on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
          showLocationDetail: { type: Boolean, defaultValue: false }
          showCitationDetail: { type: Boolean, defaultValue: false }
          showEtymologyDetail: { type: Boolean, defaultValue: false }
          showCollectionDetail: { type: Boolean, defaultValue: false }
        ) {
        oid
        newNames(first: $count, after: $cursor)
          @connection(key: "ArticleNewNames_newNames") {
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
    getConnectionFromProps: (props) => props.articleInner.newNames,
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
        oid: props.articleInner.oid,
        showLocationDetail,
        showCitationDetail,
        showCollectionDetail,
        showEtymologyDetail,
      };
    },
    query: graphql`
      query ArticleNewNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
      ) {
        article(oid: $oid) {
          ...ArticleNewNames_articleInner
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

interface ArticleNewNamesProps {
  article: ArticleNewNames_article;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
}

class ArticleNewNames extends React.Component<
  ArticleNewNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
  }
> {
  constructor(props: ArticleNewNamesProps) {
    super(props);
    this.state = {
      showLocationDetail: false,
      showCitationDetail: false,
      showCollectionDetail: false,
      showEtymologyDetail: false,
    };
  }

  render() {
    const { article, title, hideTitle, numToLoad } = this.props;
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
        <QueryRenderer<ArticleNewNamesDetailQuery>
          environment={environment}
          query={graphql`
            query ArticleNewNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
            ) {
              article(oid: $oid) {
                ...ArticleNewNames_articleInner
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
            oid: article.oid,
            showLocationDetail,
            showCitationDetail,
            showCollectionDetail,
            showEtymologyDetail,
          }}
          render={({ error, props }) => {
            if (error) {
              return <div>Failed to load</div>;
            }
            if (!props || !props.article) {
              return <div>Loading...</div>;
            }
            return (
              <ArticleNewNamesContainer
                articleInner={props.article}
                title={title}
                hideTitle={hideTitle}
                numToLoad={numToLoad}
                showLocationDetail={showLocationDetail}
                showCitationDetail={showCitationDetail}
                showCollectionDetail={showCollectionDetail}
                showEtymologyDetail={showEtymologyDetail}
                setShowDetail={undefined}
              />
            );
          }}
        />
      );
    }
    return (
      <ArticleNewNamesContainer
        articleInner={article}
        title={title}
        hideTitle={hideTitle}
        numToLoad={numToLoad}
        showLocationDetail={showLocationDetail}
        showCitationDetail={showCitationDetail}
        showCollectionDetail={showCollectionDetail}
        showEtymologyDetail={showEtymologyDetail}
        setShowDetail={undefined}
      />
    );
  }
}

export default createFragmentContainer(ArticleNewNames, {
  article: graphql`
    fragment ArticleNewNames_article on Article {
      oid
      ...ArticleNewNames_articleInner
    }
  `,
});
