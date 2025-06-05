import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";

const properties: INodeProperties[] = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the contact to delete",
  },
];

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
  const returnData: INodeExecutionData[] = [];

  const id = this.getNodeParameter("id", i) as string;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "DELETE",
    `/contacts/${id}`,
    {}
  );

  returnData.push(responseData);

  return returnData;
}
