import * as React from "react";

import { ArticlePartiallySuppressedNames_article } from "./__generated__/ArticlePartiallySuppressedNames_article.graphql";
import { ArticlePartiallySuppressedNames_articleInner } from "./__generated__/ArticlePartiallySuppressedNames_articleInner.graphql";
import { ArticlePartiallySuppressedNamesDetailQuery } from "./__generated__/ArticlePartiallySuppressedNamesDetailQuery.graphql";

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

interface ArticlePartiallySuppressedNamesInnerProps {
  articleInner: ArticlePartiallySuppressedNames_articleInner;
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
  groupVariants?: boolean;
  wrapperTitle?: string;
  context?: Context;
}

class ArticlePartiallySuppressedNamesInner extends React.Component<ArticlePartiallySuppressedNamesInnerProps> {
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
      groupVariants,
      wrapperTitle,
      context,
    } = this.props;
    if (
      !articleInner.partiallySuppressedNames ||
      articleInner.partiallySuppressedNames.edges.length === 0
    ) {
      return null;
    }
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "PartiallySuppressedNames"} (
            {articleInner.numPartiallySuppressedNames})
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
          connection={articleInner.partiallySuppressedNames}
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

const ArticlePartiallySuppressedNamesContainer = createPaginationContainer(
  ArticlePartiallySuppressedNamesInner,
  {
    articleInner: graphql`
      fragment ArticlePartiallySuppressedNames_articleInner on Article
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
        numPartiallySuppressedNames
        partiallySuppressedNames(first: $count, after: $cursor)
          @connection(key: "ArticlePartiallySuppressedNames_partiallySuppressedNames") {
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
    getConnectionFromProps: (props) => props.articleInner.partiallySuppressedNames,
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
      query ArticlePartiallySuppressedNamesPaginationQuery(
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
          ...ArticlePartiallySuppressedNames_articleInner
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

interface ArticlePartiallySuppressedNamesProps {
  article: ArticlePartiallySuppressedNames_article;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  groupVariants?: boolean;
  showLocationDetail?: boolean;
  showCitationDetail?: boolean;
  showCollectionDetail?: boolean;
  showEtymologyDetail?: boolean;
  showNameDetail?: boolean;
  wrapperTitle?: string;
  context?: Context;
}

class ArticlePartiallySuppressedNames extends React.Component<
  ArticlePartiallySuppressedNamesProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: ArticlePartiallySuppressedNamesProps) {
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
    article: Omit<ArticlePartiallySuppressedNames_article, "oid" | " $refType">,
  ) {
    const { title, hideTitle, numToLoad, groupVariants, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Article";
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
    } = this.state;
    return (
      <ArticlePartiallySuppressedNamesContainer
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
        <QueryRenderer<ArticlePartiallySuppressedNamesDetailQuery>
          environment={environment}
          query={graphql`
            query ArticlePartiallySuppressedNamesDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
              $showNameDetail: Boolean!
            ) {
              article(oid: $oid) {
                ...ArticlePartiallySuppressedNames_articleInner
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

export default createFragmentContainer(ArticlePartiallySuppressedNames, {
  article: graphql`
    fragment ArticlePartiallySuppressedNames_article on Article
    @argumentDefinitions(
      showLocationDetail: { type: Boolean, defaultValue: false }
      showCitationDetail: { type: Boolean, defaultValue: false }
      showEtymologyDetail: { type: Boolean, defaultValue: false }
      showCollectionDetail: { type: Boolean, defaultValue: false }
      showNameDetail: { type: Boolean, defaultValue: false }
    ) {
      oid
      ...ArticlePartiallySuppressedNames_articleInner
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
