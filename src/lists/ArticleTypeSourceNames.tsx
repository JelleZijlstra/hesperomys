import * as React from "react";

import { ArticleTypeSourceNames_article } from "./__generated__/ArticleTypeSourceNames_article.graphql";
import { ArticleTypeSourceNames_articleInner } from "./__generated__/ArticleTypeSourceNames_articleInner.graphql";
import { ArticleTypeSourceNamesDetailQuery } from "./__generated__/ArticleTypeSourceNamesDetailQuery.graphql";

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

interface ArticleTypeSourceNamesInnerProps {
  articleInner: ArticleTypeSourceNames_articleInner;
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

class ArticleTypeSourceNamesInner extends React.Component<
  ArticleTypeSourceNamesInnerProps
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
      setShowDetail,
    } = this.props;
    if (
      !articleInner.typeSourceNames ||
      articleInner.typeSourceNames.edges.length === 0
    ) {
      return null;
    }
    return (
      <>
        {!hideTitle && <h3>{title || "TypeSourceNames"}</h3>}
        <NameList connection={articleInner.typeSourceNames} />
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

const ArticleTypeSourceNamesContainer = createPaginationContainer(
  ArticleTypeSourceNamesInner,
  {
    articleInner: graphql`
      fragment ArticleTypeSourceNames_articleInner on Article
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: null }
          showLocationDetail: { type: Boolean, defaultValue: false }
          showCitationDetail: { type: Boolean, defaultValue: false }
          showEtymologyDetail: { type: Boolean, defaultValue: false }
          showCollectionDetail: { type: Boolean, defaultValue: false }
        ) {
        oid
        typeSourceNames(first: $count, after: $cursor)
          @connection(key: "ArticleTypeSourceNames_typeSourceNames") {
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
    getConnectionFromProps: (props) => props.articleInner.typeSourceNames,
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
      query ArticleTypeSourceNamesPaginationQuery(
        $count: Int!
        $cursor: String
        $oid: Int!
        $showLocationDetail: Boolean!
        $showCitationDetail: Boolean!
        $showCollectionDetail: Boolean!
        $showEtymologyDetail: Boolean!
      ) {
        article(oid: $oid) {
          ...ArticleTypeSourceNames_articleInner
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

interface ArticleTypeSourceNamesProps {
  article: ArticleTypeSourceNames_article;
  title?: string;
  hideTitle?: boolean;
  numToLoad?: number;
}

class ArticleTypeSourceNames extends React.Component<
  ArticleTypeSourceNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
  }
> {
  constructor(props: ArticleTypeSourceNamesProps) {
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
        <QueryRenderer<ArticleTypeSourceNamesDetailQuery>
          environment={environment}
          query={graphql`
            query ArticleTypeSourceNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
            ) {
              article(oid: $oid) {
                ...ArticleTypeSourceNames_articleInner
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
              <ArticleTypeSourceNamesContainer
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
      <ArticleTypeSourceNamesContainer
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

export default createFragmentContainer(ArticleTypeSourceNames, {
  article: graphql`
    fragment ArticleTypeSourceNames_article on Article {
      oid
      ...ArticleTypeSourceNames_articleInner
    }
  `,
});
