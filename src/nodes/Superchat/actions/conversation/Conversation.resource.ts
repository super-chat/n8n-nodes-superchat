import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as deleteOperation from "./delete.operation";
import * as getOperation from "./get.operation";
import * as updateAssigneesOperation from "./updateAssignees.operation";
import * as updateLabelsOperation from "./updateLabels.operation";
import * as updateStatusOperation from "./updateStatus.operation";

const CONVERSATION_OPERATION_OPTIONS = [
  {
    value: "get",
    name: "Get A Conversation By ID",
    action: "Retrieve a conversation in Superchat",
  },
  {
    value: "updateLabels",
    name: "Update Labels",
    action: "Update the labels of a conversation in Superchat",
  },
  {
    value: "updateStatus",
    name: "Update Status",
    action: "Update the status of a conversation in Superchat",
  },
  {
    value: "updateAssignees",
    name: "Update Assigned Users",
    action: "Update the assignees of a conversation in Superchat",
  },
  {
    value: "delete",
    name: "Delete A Conversation",
    action: "Delete a conversation in Superchat",
  },
] as const;

export type ConversationOperationKey =
  (typeof CONVERSATION_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<
  ConversationOperationKey,
  INodeProperties[]
> = {
  get: getOperation.description,
  updateLabels: updateLabelsOperation.description,
  updateStatus: updateStatusOperation.description,
  updateAssignees: updateAssigneesOperation.description,
  delete: deleteOperation.description,
};

export const description = [
  // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    required: true,
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["conversation" satisfies ResourceKey],
      },
    },
    options: [...CONVERSATION_OPERATION_OPTIONS],
    default: "get" satisfies ConversationOperationKey,
  },

  ...Object.values(OPERATION_DESCRIPTIONS).flat(),
] as const satisfies INodeProperties[];
