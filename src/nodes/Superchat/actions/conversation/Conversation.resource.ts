import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as getOperation from "./get.operation";

const CONVERSATION_OPERATION_OPTIONS = [
  {
    value: "get",
    name: "Get A Conversation By ID",
    action: "Retrieve the information about a conversation by ID",
  },
] as const;

export type ConversationOperationKey =
  (typeof CONVERSATION_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<
  ConversationOperationKey,
  INodeProperties[]
> = {
  get: getOperation.description,
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
