import { NameList_connection } from "./__generated__/NameList_connection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink, { Context } from "./ModelLink";
import { Detail } from "./NameTypeTags";
import { toTitle } from "../utils";

type Name = Exclude<Exclude<NameList_connection["edges"][0], null>["node"], null>;
type Taxon = Exclude<Name["taxon"]["class_"], null>;
type OrderBy = "classification" | "name" | "page";

type NameGroup = {
  baseName?: Name;
  names: Name[];
};
type TreeNode = {
  directChildren: Name[];
  groups: Map<number, NameGroup>;
  groupKeys: number[];
  childNodes: Map<string, { taxon: Taxon; node: TreeNode }>;
};

const makeNode = () => {
  return {
    directChildren: [],
    childNodes: new Map(),
    groups: new Map(),
    groupKeys: [],
  };
};

const STATUS_TO_SORT_KEY = new Map([
  ["valid", 0],
  ["species_inquirenda", 1],
  ["nomen_dubium", 2],
  ["composite", 3],
  ["hybrid", 4],
  ["synonym", 9],
  ["dubious", 10],
  ["spurious", 11],
  ["removed", 12],
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

const stringifySpeciesTypeKind = (kind?: string | null) => {
  switch (kind) {
    case null:
    case undefined:
      return "Type";
    case "nonexistent":
      return "No type specimen in existence";
    default:
      return toTitle(kind);
  }
};

function NameRow({
  name,
  context,
  childNames,
}: {
  name: Name;
  context?: Context;
  childNames?: Name[];
}) {
  const items = [];
  if (name.verbatimCitation) {
    items.push(<li>Raw citation: {name.verbatimCitation}</li>);
  }
  if (name.typeLocality) {
    items.push(
      <li>
        Type locality: <ModelLink model={name.typeLocality} />
      </li>,
    );
  }
  if (name.nameType) {
    items.push(
      <li>
        {name.group === "family" ? "Type genus" : "Type species"}:{" "}
        <ModelLink model={name.nameType} />
      </li>,
    );
  }
  if (name.typeSpecimen || name.speciesTypeKind) {
    items.push(
      <li>
        {stringifySpeciesTypeKind(name.speciesTypeKind)}
        {name.typeSpecimen && ": " + name.typeSpecimen}
      </li>,
    );
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
            </li>,
          );
      }
    });
  }
  return (
    <li key={name.oid}>
      <ModelLink model={name} context={context} />
      {items.length > 0 && <ul>{items}</ul>}
      {childNames && childNames.length > 0 && (
        <ul>
          {childNames.map((childName) => (
            <NameRow key={childName.oid} name={childName} context={context} />
          ))}
        </ul>
      )}
    </li>
  );
}

function OrderBySelector({
  orderBy,
  setOrderBy,
}: {
  orderBy: OrderBy;
  setOrderBy: (orderBy: OrderBy) => void;
}) {
  // Otherwise things break if there is more than one OrderBySelector on the page
  const uniqueId = React.useMemo(() => Math.random().toString(), []);
  return (
    <div style={{ float: "right", border: "solid 1px grey", padding: "10px" }}>
      <legend>Order by: </legend>
      <br />
      {(
        [
          ["classification", "Classification"],
          ["name", "Name"],
          ["page", "Page"],
        ] as [OrderBy, string][]
      ).map(([value, label]) => (
        <React.Fragment key={value}>
          <label htmlFor={value} onClick={() => orderBy !== value && setOrderBy(value)}>
            <input
              id={value}
              type="radio"
              name={`orderBy-${uniqueId}`}
              value={value}
              defaultChecked={orderBy === value}
            />{" "}
            {label}
          </label>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}

function defaultOrderBy(context?: Context): OrderBy {
  switch (context) {
    case "Article":
      return "page";
    default:
      return "classification";
  }
}

function getNameForSort(name: Name) {
  if (name.correctedOriginalName) {
    return name.correctedOriginalName;
  }
  return name.rootName;
}

function orderNames(unorderedNames: (Name | null)[], orderBy: OrderBy) {
  switch (orderBy) {
    case "classification":
      return unorderedNames.sort((left, right) => {
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
    case "name":
      return unorderedNames.sort((left, right) => {
        if (!left || !right) {
          return 0;
        }
        const leftName = getNameForSort(left);
        const rightName = getNameForSort(right);
        if (leftName < rightName) {
          return -1;
        } else if (leftName > rightName) {
          return 1;
        } else {
          return 0;
        }
      });
    case "page":
      return unorderedNames; // server uses this ordering
  }
}

function NameList({
  connection,
  hideClassification,
  groupVariants,
  context,
}: {
  connection: NameList_connection;
  hideClassification?: boolean;
  groupVariants?: boolean;
  context?: Context;
}) {
  const [orderBy, setOrderBy] = React.useState<OrderBy>(defaultOrderBy(context));
  const unorderedNames = connection.edges
    .map((edge) => edge && edge.node)
    .filter((node) => !!node);
  const names = orderNames(unorderedNames, orderBy);
  const treeRoot: TreeNode = makeNode();
  const addName = (treeNode: TreeNode, parents: (Taxon | null)[], name: Name) => {
    if (parents.length === 0) {
      if (groupVariants) {
        const variantBase = name.variantBaseId;
        const existing = treeNode.groups.get(variantBase);
        if (existing) {
          if (name.oid === variantBase) {
            existing.baseName = name;
          } else {
            existing.names.push(name);
          }
        } else {
          if (name.oid === variantBase) {
            treeNode.groups.set(variantBase, { baseName: name, names: [] });
          } else {
            treeNode.groups.set(variantBase, { names: [name] });
          }
          treeNode.groupKeys.push(variantBase);
        }
      } else {
        treeNode.directChildren.push(name);
      }
    } else if (parents[0] === null) {
      addName(treeNode, parents.slice(1), name);
    } else {
      const parent = parents[0];
      const remaining = parents.slice(1);
      if (!treeNode.childNodes.has(parent.validName)) {
        treeNode.childNodes.set(parent.validName, {
          taxon: parent,
          node: makeNode(),
        });
      }
      const childGroup = treeNode.childNodes.get(parent.validName);
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
      orderBy === "classification"
        ? [name.taxon.class_, name.taxon.order, name.taxon.family]
        : [],
      name,
    );
  });
  return (
    <>
      <OrderBySelector orderBy={orderBy} setOrderBy={setOrderBy} />
      {renderTree(treeRoot, context)}
    </>
  );
}

function renderTree(node: TreeNode, context: Context) {
  return (
    <ul>
      {Array.from(node.childNodes.values()).map((childGroup) => (
        <li key={childGroup.taxon.oid}>
          <ModelLink model={childGroup.taxon} context={context} />
          {renderTree(childGroup.node, context)}
        </li>
      ))}
      {node.directChildren.map((name) => (
        <NameRow key={name.oid} name={name} context={context} />
      ))}
      {node.groups.size > 0 &&
        node.groupKeys.map((groupKey) => {
          const group = node.groups.get(groupKey);
          if (!group) {
            return null;
          }
          return group.baseName ? (
            <NameRow
              key={group.baseName.oid}
              name={group.baseName}
              context={context}
              childNames={group.names}
            />
          ) : (
            group.names.map((name) => (
              <NameRow key={name.oid} name={name} context={context} />
            ))
          );
        })}
    </ul>
  );
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
          correctedOriginalName
          variantBaseId
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
          nameType: type @include(if: $showNameDetail) {
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
