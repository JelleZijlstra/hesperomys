import * as React from "react";

import { NameIncorrectSubsequentSpellings_name } from "./__generated__/NameIncorrectSubsequentSpellings_name.graphql";
import { NameIncorrectSubsequentSpellings_nameInner } from "./__generated__/NameIncorrectSubsequentSpellings_nameInner.graphql";
import { NameIncorrectSubsequentSpellingsDetailQuery } from "./__generated__/NameIncorrectSubsequentSpellingsDetailQuery.graphql";

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

interface NameIncorrectSubsequentSpellingsInnerProps {
  nameInner: NameIncorrectSubsequentSpellings_nameInner;
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

class NameIncorrectSubsequentSpellingsInner extends React.Component<NameIncorrectSubsequentSpellingsInnerProps> {
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
      groupVariants,
      wrapperTitle,
      context,
    } = this.props;
    if (
      !nameInner.incorrectSubsequentSpellings ||
      nameInner.incorrectSubsequentSpellings.edges.length === 0
    ) {
      return null;
    }
    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "IncorrectSubsequentSpellings"} (
            {nameInner.numIncorrectSubsequentSpellings})
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
          connection={nameInner.incorrectSubsequentSpellings}
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

const NameIncorrectSubsequentSpellingsContainer = createPaginationContainer(
  NameIncorrectSubsequentSpellingsInner,
  {
    nameInner: graphql`
      fragment NameIncorrectSubsequentSpellings_nameInner on Name
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
        numIncorrectSubsequentSpellings
        incorrectSubsequentSpellings(first: $count, after: $cursor)
          @connection(
            key: "NameIncorrectSubsequentSpellings_incorrectSubsequentSpellings"
          ) {
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
    getConnectionFromProps: (props) => props.nameInner.incorrectSubsequentSpellings,
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
      query NameIncorrectSubsequentSpellingsPaginationQuery(
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
          ...NameIncorrectSubsequentSpellings_nameInner
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

interface NameIncorrectSubsequentSpellingsProps {
  name: NameIncorrectSubsequentSpellings_name;
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

class NameIncorrectSubsequentSpellings extends React.Component<
  NameIncorrectSubsequentSpellingsProps,
  {
    showLocationDetail: boolean;
    showCitationDetail: boolean;
    showCollectionDetail: boolean;
    showEtymologyDetail: boolean;
    showNameDetail: boolean;
  }
> {
  constructor(props: NameIncorrectSubsequentSpellingsProps) {
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

  renderInner(name: Omit<NameIncorrectSubsequentSpellings_name, "oid" | " $refType">) {
    const { title, hideTitle, numToLoad, groupVariants, subtitle, wrapperTitle } =
      this.props;
    const context = this.props.context || "Name";
    const {
      showLocationDetail,
      showCitationDetail,
      showCollectionDetail,
      showEtymologyDetail,
      showNameDetail,
    } = this.state;
    return (
      <NameIncorrectSubsequentSpellingsContainer
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
        groupVariants={groupVariants}
        wrapperTitle={wrapperTitle}
        context={context}
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
        <QueryRenderer<NameIncorrectSubsequentSpellingsDetailQuery>
          environment={environment}
          query={graphql`
            query NameIncorrectSubsequentSpellingsDetailQuery(
              $oid: Int!
              $showLocationDetail: Boolean!
              $showCitationDetail: Boolean!
              $showCollectionDetail: Boolean!
              $showEtymologyDetail: Boolean!
              $showNameDetail: Boolean!
            ) {
              name(oid: $oid) {
                ...NameIncorrectSubsequentSpellings_nameInner
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

export default createFragmentContainer(NameIncorrectSubsequentSpellings, {
  name: graphql`
    fragment NameIncorrectSubsequentSpellings_name on Name
    @argumentDefinitions(
      showLocationDetail: { type: Boolean, defaultValue: false }
      showCitationDetail: { type: Boolean, defaultValue: false }
      showEtymologyDetail: { type: Boolean, defaultValue: false }
      showCollectionDetail: { type: Boolean, defaultValue: false }
      showNameDetail: { type: Boolean, defaultValue: false }
    ) {
      oid
      ...NameIncorrectSubsequentSpellings_nameInner
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
