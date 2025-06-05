import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as getOperation from "./get.operation";
import * as updateAssigneesOperation from "./updateAssignees.operation";
import * as updateLabelsOperation from "./updateLabels.operation";
import * as updateStatusOperation from "./updateStatus.operation";

const CONVERSATION_OPERATION_OPTIONS = [
  {
    value: "get",
    name: "Get A Conversation By ID",
    action: "Retrieve the information about a conversation by ID",
  },
  {
    value: "updateLabels",
    name: "Update Labels",
    action: "Update the labels of a conversation",
  },
  {
    value: "updateStatus",
    name: "Update Status",
    action: "Update the status of a conversation",
  },
  {
    value: "updateAssignees",
    name: "Update Assigned Users",
    action: "Update the users assigned to a conversation",
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
