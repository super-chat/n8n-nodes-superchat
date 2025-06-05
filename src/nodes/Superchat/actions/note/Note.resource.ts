import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as createOperation from "./create.operation";
import * as getOperation from "./get.operation";

const NOTE_OPERATION_OPTIONS = [
  {
    value: "create",
    name: "Create A Note",
    action: "Create a note in Superchat.",
  },
  {
    value: "get",
    name: "Get A Note By ID",
    action: "Retrieve the information about a note by ID",
  },
] as const;

export type NoteOperationKey = (typeof NOTE_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<NoteOperationKey, INodeProperties[]> = {
  create: createOperation.description,
  get: getOperation.description,
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
        resource: ["note" satisfies ResourceKey],
      },
    },
    options: [...NOTE_OPERATION_OPTIONS],
    default: "create" satisfies NoteOperationKey,
  },

  ...Object.values(OPERATION_DESCRIPTIONS).flat(),
];
