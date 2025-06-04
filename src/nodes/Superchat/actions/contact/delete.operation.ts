import type {
  INodeExecutionData,
  INodeProperties,
  IExecuteFunctions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";
import { superchatApiRequest } from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "ID",
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["delete" satisfies ContactOperationKey],
      },
    },
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the contact to delete",
  },
];

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const id = this.getNodeParameter("id", i) as string;

  const responseData = await superchatApiRequest.call(
    this,
    "DELETE",
    `/contacts/${id}`,
    {}
  );

  returnData.push(responseData);

  return returnData;
}
