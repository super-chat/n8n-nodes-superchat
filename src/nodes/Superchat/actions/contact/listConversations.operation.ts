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
    displayName: "Contact ID",
    name: "contactId",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the contact whose conversations you want to list",
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["contact" satisfies ResourceKey],
      operation: ["listConversations" satisfies ContactOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const contactId = this.getNodeParameter("contactId", i) as string;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "GET",
    `/contacts/${contactId}/conversations`,
    {}
  );

  returnData.push({ json: responseData });
  return returnData;
}
