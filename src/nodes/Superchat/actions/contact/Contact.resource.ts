import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as createOperation from "./create.operation";
import * as deleteOperation from "./delete.operation";
import * as listConversationsOperation from "./listConversations.operation";
import * as searchOperation from "./search.operation";
import * as updateOperation from "./update.operation";

const CONTACT_OPERATION_OPTIONS = [
  {
    value: "search",
    name: "Search For A Contact",
    action: "Search for a contact",
  },
  {
    value: "delete",
    name: "Delete A Contact",
    action: "Delete a contact",
  },
  {
    value: "create",
    name: "Create A Contact",
    action: "Create a new contact",
  },
  {
    value: "update",
    name: "Update A Contact",
    action: "Update an existing contact",
  },
  {
    value: "listConversations",
    name: "List Conversations",
    action: "List all conversations of a contact",
  },
] as const;

export type ContactOperationKey =
  (typeof CONTACT_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<ContactOperationKey, INodeProperties[]> = {
  search: searchOperation.description,
  delete: deleteOperation.description,
  create: createOperation.description,
  update: updateOperation.description,
  listConversations: listConversationsOperation.description,
};

export const description: INodeProperties[] = [
  // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    required: true,
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
      },
    },
    options: [...CONTACT_OPERATION_OPTIONS],
    default: "search" satisfies ContactOperationKey,
  },
  ...Object.values(OPERATION_DESCRIPTIONS).flat(),
];
