import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as meOperation from "./me.operation";

const USER_OPERATION_OPTIONS = [
  {
    value: "me",
    name: "Identify Yourself",
    action: "Retrieve the information about yourself as a superchat user",
  },
] as const;

export type UserOperationKey = (typeof USER_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<UserOperationKey, INodeProperties[]> = {
  me: meOperation.description,
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
        resource: ["user" satisfies ResourceKey],
      },
    },
    options: [...USER_OPERATION_OPTIONS],
    default: "me" satisfies UserOperationKey,
  },

  ...Object.values(OPERATION_DESCRIPTIONS).flat(),
] as const satisfies INodeProperties[];
