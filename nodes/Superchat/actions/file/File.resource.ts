import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as createOperation from "./create.operation";
import * as deleteOperation from "./delete.operation";
import * as downloadOperation from "./download.operation";

const FILE_OPERATION_OPTIONS = [
  {
    value: "create",
    name: "Create File",
    action: "Create a file",
  },
  {
    value: "delete",
    name: "Delete File",
    action: "Delete a file",
  },
  {
    value: "download",
    name: "Download File",
    action: "Download a file",
  },
] as const;

export type FileOperationKey = (typeof FILE_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<FileOperationKey, INodeProperties[]> = {
  create: createOperation.description,
  delete: deleteOperation.description,
  download: downloadOperation.description,
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
