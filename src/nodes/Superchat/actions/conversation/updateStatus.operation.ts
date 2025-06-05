import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { ConversationOperationKey } from "./Conversation.resource";
import { superchatApiRequest } from "../../GenericFunctions";
import { PAUpdateConversationDTO } from "../../../../types/PAUpdateConversationDTO";
import { ConversationStatus } from "../../../../types/ConversationStatus";

const properties: INodeProperties[] = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the conversation",
  },
  // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
  {
    displayName: "Status",
    name: "status",
    type: "options",
    options: [
      { name: "Open", value: "open" satisfies ConversationStatus },
      { name: "Done", value: "done" satisfies ConversationStatus },
      { name: "Spam", value: "spam" satisfies ConversationStatus },
      { name: "Archived", value: "archived" satisfies ConversationStatus },
      { name: "Snoozed", value: "snoozed" satisfies ConversationStatus },
    ],
    default: "open" satisfies ConversationStatus,
    description: "The status of the conversation",
  },
  {
    displayName: "Snoozed Until",
    name: "snoozedUntil",
    type: "dateTime",
    default: "",
    description:
      "The date and time until the conversation is snoozed. Only required if status is 'snoozed'.",
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["conversation" satisfies ResourceKey],
      operation: ["updateStatus" satisfies ConversationOperationKey],
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
  const status = this.getNodeParameter("status", i) as ConversationStatus;
  const snoozedUntil = this.getNodeParameter("snoozedUntil", i) as string;

  const body = {
    status,
    ...(status === "snoozed" && {
      snoozed_until: snoozedUntil
        ? new Date(snoozedUntil).toISOString()
        : undefined,
    }),
  } satisfies PAUpdateConversationDTO;

  const responseData = await superchatApiRequest.call(
    this,
    "PATCH",
    `/conversations/${id}`,
    body
  );

  returnData.push(responseData);

  return returnData;
}
