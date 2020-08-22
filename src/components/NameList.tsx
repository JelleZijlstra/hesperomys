import { NameList_connection } from "./__generated__/NameList_connection.graphql";

import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import ModelLink from "./ModelLink";

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

class NameList extends React.Component<{ connection: NameList_connection }> {
  render() {
    const { connection } = this.props;
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
        [name.taxon.class_, name.taxon.order, name.taxon.family],
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
            <b>
              <ModelLink model={childGroup.taxon} />
            </b>
            {this.renderTree(childGroup.node)}
          </li>
        ))}
        {node.directChildren.map((name) => (
          <li key={name.oid}>
            <ModelLink model={name} />
          </li>
        ))}
      </ul>
    );
  }
}

export default createFragmentContainer(NameList, {
  connection: graphql`
    fragment NameList_connection on NameConnection {
      edges {
        node {
          ...ModelLink_model
          oid
          status
          rootName
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
