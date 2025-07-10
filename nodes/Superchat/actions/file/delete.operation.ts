import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { createTypesafeParameterGetter } from "../../../../utils/magic";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { FileOperationKey } from "./File.resource";

const properties = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the file to delete",
  },
] as const satisfies INodeProperties[];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["file" satisfies ResourceKey],
      operation: ["delete" satisfies FileOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const id = getNodeParameter(this, "id", i);

  await superchatJsonApiRequest.call(this, "DELETE", `/files/${id}`, {});

  return { json: { deleted: true } };
}
