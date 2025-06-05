import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { FileOperationKey } from "./File.resource";
import { superchatJsonApiRequest } from "../../GenericFunctions";

const properties: INodeProperties[] = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the file to delete",
  },
];

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
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const id = this.getNodeParameter("id", i) as string;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "DELETE",
    `/files/${id}`,
    {}
  );

  returnData.push(responseData);

  return returnData;
}
