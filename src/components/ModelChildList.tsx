import { ModelChildList_model } from "./__generated__/ModelChildList_model.graphql";
import { ModelChildListCollectionQuery } from "./__generated__/ModelChildListCollectionQuery.graphql";
import { ModelChildListTaxonQuery } from "./__generated__/ModelChildListTaxonQuery.graphql";
import { ModelChildListLocationQuery } from "./__generated__/ModelChildListLocationQuery.graphql";
import { ModelChildListRegionQuery } from "./__generated__/ModelChildListRegionQuery.graphql";
import { ModelChildListPeriodQuery } from "./__generated__/ModelChildListPeriodQuery.graphql";
import { ModelChildListStratigraphicUnitQuery } from "./__generated__/ModelChildListStratigraphicUnitQuery.graphql";

import React from "react";
import environment from "../relayEnvironment";
import { createFragmentContainer, QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import CollectionTypeSpecimens from "../lists/CollectionTypeSpecimens";
import TaxonChildren from "../lists/TaxonChildren";
import TaxonNames from "../lists/TaxonNames";
import LocationTypeLocalities from "../lists/LocationTypeLocalities";
import RegionChildren from "../lists/RegionChildren";
import RegionLocations from "../lists/RegionLocations";
import PeriodChildren from "../lists/PeriodChildren";
import PeriodLocations from "../lists/PeriodLocations";
import StratigraphicUnitChildren from "../lists/StratigraphicUnitChildren";
import StratigraphicUnitLocations from "../lists/StratigraphicUnitLocations";

export function supportsChildren(
  model: Omit<ModelChildList_model, " $refType">
): boolean {
  switch (model.__typename) {
    case "Collection":
      return !!model.numTypeSpecimens;
    case "Taxon":
      return !!model.numChildren || !!model.numNames;
    case "Location":
      return !!model.numTypeLocalities;
    case "Region":
      return !!model.numChildren || !!model.numLocations;
    case "Period":
      return !!model.numChildren || !!model.numLocations;
    case "StratigraphicUnit":
      return !!model.numChildren || !!model.numLocations;
    default:
      return false;
  }
}

class ModelChildList extends React.Component<{ model: ModelChildList_model }> {
  render() {
    const { model } = this.props;
    const { id, __typename } = model;
    if (!id) {
      return null;
    }
    switch (__typename) {
      case "Collection":
        return (
          <QueryRenderer<ModelChildListCollectionQuery>
            environment={environment}
            query={graphql`
              query ModelChildListCollectionQuery($id: ID!) {
                node(id: $id) {
                  ...CollectionTypeSpecimens_collection
                }
              }
            `}
            variables={{ id }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.node) {
                return <div>Loading...</div>;
              }
              return <CollectionTypeSpecimens collection={props.node} hideTitle />;
            }}
          />
        );
      case "Taxon":
        return (
          <QueryRenderer<ModelChildListTaxonQuery>
            environment={environment}
            query={graphql`
              query ModelChildListTaxonQuery($id: ID!) {
                node(id: $id) {
                  ...TaxonNames_taxon @arguments(showNameDetail: true)
                  ...TaxonChildren_taxon
                }
              }
            `}
            variables={{ id }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.node) {
                return <div>Loading...</div>;
              }
              return (
                <>
                  <TaxonNames
                    taxon={props.node}
                    hideTitle
                    hideClassification
                    showNameDetail
                  />
                  <TaxonChildren taxon={props.node} hideTitle />
                </>
              );
            }}
          />
        );
      case "Location":
        return (
          <QueryRenderer<ModelChildListLocationQuery>
            environment={environment}
            query={graphql`
              query ModelChildListLocationQuery($id: ID!) {
                node(id: $id) {
                  ...LocationTypeLocalities_location
                }
              }
            `}
            variables={{ id }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.node) {
                return <div>Loading...</div>;
              }
              return <LocationTypeLocalities location={props.node} hideTitle />;
            }}
          />
        );
      case "Region":
        return (
          <QueryRenderer<ModelChildListRegionQuery>
            environment={environment}
            query={graphql`
              query ModelChildListRegionQuery($id: ID!) {
                node(id: $id) {
                  ...RegionChildren_region
                  ...RegionLocations_region
                }
              }
            `}
            variables={{ id }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.node) {
                return <div>Loading...</div>;
              }
              return (
                <>
                  <RegionChildren region={props.node} hideTitle />
                  <ul>
                    <li>
                      <i>Locations</i>
                    </li>
                    <RegionLocations region={props.node} hideTitle hideChildren />
                  </ul>
                </>
              );
            }}
          />
        );
      case "Period":
        return (
          <QueryRenderer<ModelChildListPeriodQuery>
            environment={environment}
            query={graphql`
              query ModelChildListPeriodQuery($id: ID!) {
                node(id: $id) {
                  ...PeriodChildren_period
                  ...PeriodLocations_period
                }
              }
            `}
            variables={{ id }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.node) {
                return <div>Loading...</div>;
              }
              return (
                <>
                  <PeriodChildren period={props.node} hideTitle />
                  <PeriodLocations period={props.node} hideTitle hideChildren />
                </>
              );
            }}
          />
        );
      case "StratigraphicUnit":
        return (
          <QueryRenderer<ModelChildListStratigraphicUnitQuery>
            environment={environment}
            query={graphql`
              query ModelChildListStratigraphicUnitQuery($id: ID!) {
                node(id: $id) {
                  ...StratigraphicUnitChildren_stratigraphicUnit
                  ...StratigraphicUnitLocations_stratigraphicUnit
                }
              }
            `}
            variables={{ id }}
            render={({ error, props }) => {
              if (error) {
                return <div>Failed to load</div>;
              }
              if (!props || !props.node) {
                return <div>Loading...</div>;
              }
              return (
                <>
                  <StratigraphicUnitChildren stratigraphicUnit={props.node} hideTitle />
                  <StratigraphicUnitLocations
                    stratigraphicUnit={props.node}
                    hideTitle
                    hideChildren
                  />
                </>
              );
            }}
          />
        );
      default:
        return null;
    }
  }
}

export default createFragmentContainer(ModelChildList, {
  model: graphql`
    fragment ModelChildList_model on Model {
      __typename
      ... on Node {
        id
      }
      ... on Collection {
        numTypeSpecimens
      }
      ... on Taxon {
        numChildren
        numNames
      }
      ... on Location {
        numTypeLocalities
      }
      ... on Region {
        numChildren
        numLocations
      }
      ... on Period {
        numChildren
        numLocations
      }
      ... on StratigraphicUnit {
        numChildren
        numLocations
      }
    }
  `,
});
