import { NameList_connection } from "./__generated__/NameList_connection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";
import { Detail } from "./NameTypeTags";

type Name = Exclude<
  Exclude<NameList_connection["edges"][0], null>["node"],
  null
>;
type Taxon = Exclude<Name["taxon"]["class_"], null>;
type TreeNode = {
  directChildren: Name[];
  childGroups: Map<string, { taxon: Taxon; node: TreeNode }>;
};

const makeNode = () => {
  return { directChildren: [], childGroups: new Map() };
};

const STATUS_TO_SORT_KEY = new Map([
  ["valid", 0],
  ["species_inquirenda", 1],
  ["nomen_dubium", 2],
  ["synonym", 3],
  ["dubious", 4],
  ["spurious", 5],
  ["removed", 6],
]);

const sortKey = (name: Name | null) => {
  if (!name || !name.taxon) {
    return [];
  }
  const cls = name.taxon.class_ && name.taxon.class_.validName;
  const order = name.taxon.order && name.taxon.order.validName;
  const family = name.taxon.family && name.taxon.family.validName;
  const status = STATUS_TO_SORT_KEY.get(name.status);
  return [cls, order, family, name.taxon.validName, status, name.rootName];
};

class NameList extends React.Component<{
  connection: NameList_connection;
  hideClassification?: boolean;
}> {
  render() {
    const { connection, hideClassification } = this.props;
    const names = connection.edges
      .map((edge) => edge && edge.node)
      .filter((node) => !!node)
      .sort((left, right) => {
        const leftKey = sortKey(left);
        const rightKey = sortKey(right);
        if (leftKey < rightKey) {
          return -1;
        } else if (leftKey > rightKey) {
          return 1;
        } else {
          return 0;
        }
      });
    const treeRoot: TreeNode = makeNode();
    const addName = (
      treeNode: TreeNode,
      parents: (Taxon | null)[],
      name: Name
    ) => {
      if (parents.length === 0) {
        treeNode.directChildren.push(name);
      } else if (parents[0] === null) {
        addName(treeNode, parents.slice(1), name);
      } else {
        const parent = parents[0];
        const remaining = parents.slice(1);
        if (!treeNode.childGroups.has(parent.validName)) {
          treeNode.childGroups.set(parent.validName, {
            taxon: parent,
            node: makeNode(),
          });
        }
        const childGroup = treeNode.childGroups.get(parent.validName);
        if (!childGroup) {
          return null; // should never happen
        }
        addName(childGroup.node, remaining, name);
      }
    };
    names.forEach((name) => {
      if (!name || !name.taxon) {
        return;
      }
      addName(
        treeRoot,
        hideClassification
          ? []
          : [name.taxon.class_, name.taxon.order, name.taxon.family],
        name
      );
    });
    return this.renderTree(treeRoot);
  }

  renderTree(node: TreeNode) {
    return (
      <ul>
        {Array.from(node.childGroups.values()).map((childGroup) => (
          <li key={childGroup.taxon.oid}>
            <ModelLink model={childGroup.taxon} />
            {this.renderTree(childGroup.node)}
          </li>
        ))}
        {node.directChildren.map((name) => {
          const items = [];
          if (name.verbatimCitation) {
            items.push(<li>Raw citation: {name.verbatimCitation}</li>);
          }
          if (name.typeLocality) {
            items.push(
              <li>
                <ModelLink model={name.typeLocality} />
              </li>
            );
          }
          if (name.type) {
            items.push(
              <li>
                {name.group === "family" ? "Type genus" : "Type species"}:{" "}
                <ModelLink model={name.type} />
              </li>
            );
          }
          if (name.typeSpecimen || name.speciesTypeKind) {
            items.push(
              <li>
                {name.speciesTypeKind || "Type"}
                {name.typeSpecimen && ": " + name.typeSpecimen}
              </li>
            );
          }
          if (
            name.nomenclatureStatus &&
            name.nomenclatureStatus !== "available"
          ) {
            items.push(<li>Status: {name.nomenclatureStatus}</li>);
          }
          if (name.typeTags) {
            name.typeTags.forEach((tag) => {
              if (!tag) {
                return;
              }
              switch (tag.__typename) {
                case "LocationDetail":
                case "CitationDetail":
                case "CollectionDetail":
                case "EtymologyDetail":
                  if (!tag.text) {
                    return;
                  }
                  items.push(
                    <li key={tag.text}>
                      <Detail text={tag.text} source={tag.source} />
                    </li>
                  );
              }
            });
          }
          return (
            <li key={name.oid}>
              <ModelLink model={name} />
              {items.length > 0 && <ul>{items}</ul>}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default createFragmentContainer(NameList, {
  connection: graphql`
    fragment NameList_connection on NameConnection
      @argumentDefinitions(
        showLocationDetail: { type: Boolean, defaultValue: true }
        showCitationDetail: { type: Boolean, defaultValue: false }
        showCollectionDetail: { type: Boolean, defaultValue: false }
        showEtymologyDetail: { type: Boolean, defaultValue: false }
        showNameDetail: { type: Boolean, defaultValue: false }
      ) {
      edges {
        node {
          ...ModelLink_model
          oid
          status
          rootName
          typeTags @include(if: $showLocationDetail) {
            __typename
            ... on LocationDetail {
              text
              source {
                ...ModelLink_model
              }
            }
          }

          typeTags @include(if: $showCitationDetail) {
            __typename
            ... on CitationDetail {
              text
              source {
                ...ModelLink_model
              }
            }
          }
          verbatimCitation @include(if: $showCitationDetail)

          typeTags @include(if: $showEtymologyDetail) {
            __typename
            ... on EtymologyDetail {
              text
              source {
                ...ModelLink_model
              }
            }
          }

          typeSpecimen @include(if: $showCollectionDetail)
          speciesTypeKind @include(if: $showCollectionDetail)
          typeTags @include(if: $showCollectionDetail) {
            __typename
            ... on CollectionDetail {
              text
              source {
                ...ModelLink_model
              }
            }
          }

          typeLocality @include(if: $showNameDetail) {
            ...ModelLink_model
          }
          typeSpecimen @include(if: $showNameDetail)
          speciesTypeKind @include(if: $showNameDetail)
          type @include(if: $showNameDetail) {
            ...ModelLink_model
          }
          group @include(if: $showNameDetail)
          nomenclatureStatus @include(if: $showNameDetail)

          taxon {
            validName
            class_ {
              oid
              validName
              ...ModelLink_model
            }
            order {
              oid
              validName
              ...ModelLink_model
            }
            family {
              oid
              validName
              ...ModelLink_model
            }
          }
        }
      }
    }
  `,
});
