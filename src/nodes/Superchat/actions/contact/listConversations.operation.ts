import type {
  INodeExecutionData,
  INodeProperties,
  IExecuteFunctions,
} from "n8n-workflow";
import { superchatApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";

export const description: INodeProperties[] = [
  {
    displayName: "Contact ID",
    name: "contactId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the contact whose conversations you want to list",
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["listConversations" satisfies ContactOperationKey],
      },
    },
  },
];

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const contactId = this.getNodeParameter("contactId", i) as string;

  const responseData = await superchatApiRequest.call(
    this,
    "GET",
    `/contacts/${contactId}/conversations`,
    {}
  );

  returnData.push({ json: responseData });
  return returnData;
}
