import type { INodeProperties } from "n8n-workflow";
import * as createOperation from "./create.operation";
import * as deleteOperation from "./delete.operation";
import * as searchOperation from "./search.operation";
import * as updateOperation from "./update.operation";
import * as listConversationsOperation from "./listConversations.operation";
import { ResourceKey } from "../../Superchat.node";

const CONTACT_OPERATION_OPTIONS = [
  {
    value: "search",
    name: "Search For A Contact",
    action: "Search a contact by any field.",
  },
  {
    value: "delete",
    name: "Delete A Contact",
    action: "Delete a contact in Superchat.",
  },
  {
    value: "create",
    name: "Create A Contact",
    action: "Create a new contact in Superchat.",
  },
  {
    value: "update",
    name: "Update A Contact",
    action: "Update an existing contact in Superchat.",
  },
  {
    value: "listConversations",
    name: "List Conversations",
    action: "List all conversations of a contact.",
  },
] as const;

export type ContactOperationKey =
  (typeof CONTACT_OPERATION_OPTIONS)[number]["value"];

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

  ...createOperation.description,
  ...updateOperation.description,
  ...deleteOperation.description,
  ...searchOperation.description,
  ...listConversationsOperation.description,
];
