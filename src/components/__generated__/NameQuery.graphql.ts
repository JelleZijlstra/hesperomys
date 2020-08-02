/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type NameQueryVariables = {
    oid: number;
};
export type NameQueryResponse = {
    readonly name: {
        readonly id: string;
        readonly correctedOriginalName: string | null;
    } | null;
};
export type NameQuery = {
    readonly response: NameQueryResponse;
    readonly variables: NameQueryVariables;
};



/*
query NameQuery(
  $oid: Int!
) {
  name(oid: $oid) {
    id
    correctedOriginalName
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "oid"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "oid",
        "variableName": "oid"
      }
    ],
    "concreteType": "Name",
    "kind": "LinkedField",
    "name": "name",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "correctedOriginalName",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NameQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NameQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "af2dcd02b8b3d2daea6b0049d904b360",
    "id": null,
    "metadata": {},
    "name": "NameQuery",
    "operationKind": "query",
    "text": "query NameQuery(\n  $oid: Int!\n) {\n  name(oid: $oid) {\n    id\n    correctedOriginalName\n  }\n}\n"
  }
};
})();
(node as any).hash = '0c3fd5d3b62fed60bcb732f59c535480';
export default node;
