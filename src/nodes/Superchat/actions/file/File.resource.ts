import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as createOperation from "./create.operation";

const FILE_OPERATION_OPTIONS = [
  {
    value: "create",
    name: "Create A File",
    action: "Create a file in Superchat.",
  },
] as const;

export type FileOperationKey = (typeof FILE_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<FileOperationKey, INodeProperties[]> = {
  create: createOperation.description,
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
        resource: ["file" satisfies ResourceKey],
      },
    },
    options: [...FILE_OPERATION_OPTIONS],
    default: "create" satisfies FileOperationKey,
  },

  ...Object.values(OPERATION_DESCRIPTIONS).flat(),
];
