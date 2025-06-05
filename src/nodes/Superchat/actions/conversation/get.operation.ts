import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { ConversationOperationKey } from "./Conversation.resource";
import { superchatJsonApiRequest } from "../../GenericFunctions";

const properties: INodeProperties[] = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the conversation",
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["conversation" satisfies ResourceKey],
      operation: ["get" satisfies ConversationOperationKey],
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
    "GET",
    `/conversations/${id}`,
    {}
  );

  returnData.push(responseData);

  return returnData;
}
