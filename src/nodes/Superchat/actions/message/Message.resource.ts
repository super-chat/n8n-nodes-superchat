import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as sendOperation from "./send.operation";

const MESSAGE_OPERATION_OPTIONS = [
  {
    value: "send",
    name: "Send A Message",
    action: "Send a message via Superchat.",
  },
] as const;

export type MessageOperationKey =
  (typeof MESSAGE_OPERATION_OPTIONS)[number]["value"];

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
    default: "send" satisfies MessageOperationKey,
  },

  ...sendOperation.description,
];
