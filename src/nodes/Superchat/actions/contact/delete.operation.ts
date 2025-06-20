import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { createTypesafeParameterGetter } from "../../../../magic";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";

const properties = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the contact to delete",
  },
] as const satisfies INodeProperties[];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["contact" satisfies ResourceKey],
      operation: ["delete" satisfies ContactOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const returnData: INodeExecutionData[] = [];

  const id = getNodeParameter(this, "id", i);

  const responseData = await superchatJsonApiRequest.call(
    this,
    "DELETE",
    `/contacts/${id}`,
    {}
  );

  returnData.push(responseData);

  return returnData;
}
