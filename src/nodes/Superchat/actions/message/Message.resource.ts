import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as sendMessageOperation from "./sendMessage.operation";
import * as sendMailOperation from "./sendMail.operation";

const MESSAGE_OPERATION_OPTIONS = [
  {
    value: "sendMessage",
    name: "Send A Message",
    action: "Send a message via Superchat.",
  },
  {
    value: "sendMail",
    name: "Send An Email",
    action: "Send an email via Superchat.",
  },
] as const;

export type MessageOperationKey =
  (typeof MESSAGE_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<MessageOperationKey, INodeProperties[]> = {
  sendMessage: sendMessageOperation.description,
  sendMail: sendMailOperation.description,
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
        resource: ["message" satisfies ResourceKey],
      },
    },
    options: [...MESSAGE_OPERATION_OPTIONS],
    default: "sendMessage" satisfies MessageOperationKey,
  },

  ...Object.values(OPERATION_DESCRIPTIONS).flat(),
];
