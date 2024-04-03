import * as React from "react";

import { TaxonChildList_taxon } from "./__generated__/TaxonChildList_taxon.graphql";

import { createPaginationContainer, RelayPaginationProp } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ExpandButtons from "../components/ExpandButtons";
import LoadMoreButton from "../components/LoadMoreButton";
import ModelListEntry from "../components/ModelListEntry";
import { supportsChildren } from "../components/ModelChildList";

interface TaxonChildListProps {
  taxon: TaxonChildList_taxon;
  title?: string;
  subtitle?: JSX.Element;
  hideTitle?: boolean;
  numToLoad?: number;
  relay: RelayPaginationProp;
  wrapperTitle?: string;
}

type ChildTaxon = NonNullable<
  NonNullable<NonNullable<TaxonChildList_taxon["children"]>["edges"][number]>["node"]
>;

class TaxonChildList extends React.Component<
  TaxonChildListProps,
  { expandAll: boolean }
> {
  constructor(props: TaxonChildListProps) {
    super(props);
    this.state = { expandAll: false };
  }

  render() {
    const { taxon, relay, numToLoad, hideTitle, title, subtitle, wrapperTitle } =
      this.props;
    if (!taxon.children || taxon.children.edges.length === 0) {
      return null;
    }
    const showExpandAll = taxon.children.edges.some(
      (edge) => edge && edge.node && supportsChildren(edge.node),
    );
    const mainChildren: ChildTaxon[] = [];
    const basalChildren: ChildTaxon[] = [];
    const incertaeSedisChildren: ChildTaxon[] = [];
    const dubiousChildren: ChildTaxon[] = [];
    taxon.children.edges.forEach((edge) => {
      if (!edge || !edge.node) {
        return;
      }
      const taxon = edge.node;
      if (taxon.baseName.status !== "valid") {
        dubiousChildren.push(taxon);
      } else if (taxon.tags.some((tag) => tag.__typename === "IncertaeSedis")) {
        incertaeSedisChildren.push(taxon);
      } else if (taxon.tags.some((tag) => tag.__typename === "Basal")) {
        basalChildren.push(taxon);
      } else {
        mainChildren.push(taxon);
      }
    });

    const inner = (
      <>
        {!hideTitle && (
          <h3>
            {title || "Children"} ({taxon.numChildren})
          </h3>
        )}
        {subtitle}
        <ExpandButtons
          expandAll={this.state.expandAll}
          setExpandAll={
            showExpandAll
              ? (expandAll: boolean) => this.setState({ expandAll })
              : undefined
          }
        />
        <ul>
          {mainChildren.map((taxon) => (
            <ModelListEntry
              key={taxon.oid}
              model={taxon}
              showChildren={this.state.expandAll}
            />
          ))}
          {basalChildren.length > 0 && (
            <li>
              <p>Basal taxa</p>
              <ul>
                {basalChildren.map((taxon) => (
                  <ModelListEntry
                    key={taxon.oid}
                    model={taxon}
                    showChildren={this.state.expandAll}
                  />
                ))}
              </ul>
            </li>
          )}
          {incertaeSedisChildren.length > 0 && (
            <li>
              <p>Incertae sedis</p>
              <ul>
                {incertaeSedisChildren.map((taxon) => (
                  <ModelListEntry
                    key={taxon.oid}
                    model={taxon}
                    showChildren={this.state.expandAll}
                  />
                ))}
              </ul>
            </li>
          )}
          {dubiousChildren.length > 0 && (
            <li>
              <p>Dubious taxa</p>
              <ul>
                {dubiousChildren.map((taxon) => (
                  <ModelListEntry
                    key={taxon.oid}
                    model={taxon}
                    showChildren={this.state.expandAll}
                  />
                ))}
              </ul>
            </li>
          )}
        </ul>
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

export default createPaginationContainer(
  TaxonChildList,
  {
    taxon: graphql`
      fragment TaxonChildList_taxon on Taxon
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 50 }
        cursor: { type: "String", defaultValue: null }
      ) {
        oid
        numChildren
        children(first: $count, after: $cursor)
          @connection(key: "TaxonChildList_children") {
          edges {
            node {
              oid
              __typename
              ...ModelListEntry_model
              ...ModelChildList_model @relay(mask: false)
              tags {
                __typename
              }
              baseName {
                status
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: (props) => props.taxon.children,
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        oid: props.taxon.oid,
      };
    },
    query: graphql`
      query TaxonChildListPaginationQuery($count: Int!, $cursor: String, $oid: Int!) {
        taxon(oid: $oid) {
          ...TaxonChildList_taxon @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
