import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { ConversationStatus } from "../../../../types/ConversationStatus";
import { PAUpdateConversationDTO } from "../../../../types/PAUpdateConversationDTO";
import { createTypesafeParameterGetter } from "../../../../utils/magic";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { ConversationOperationKey } from "./Conversation.resource";

const properties = [
  {
    displayName: "Conversation ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    placeholder: "e.g. cv_1234567890",
    description: "Conversation IDs start with 'cv_'",
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
    hint: "Set 'Snoozed Until' if you snooze the conversation",
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
] as const satisfies INodeProperties[];

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
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const id = getNodeParameter(this, "id", i);
  const status = getNodeParameter(this, "status", i);
  const snoozedUntil = getNodeParameter(this, "snoozedUntil", i);

  const body = {
    status,
    ...(status === "snoozed" && {
      snoozed_until: snoozedUntil
        ? new Date(snoozedUntil).toISOString()
        : undefined,
    }),
  } satisfies PAUpdateConversationDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "PATCH",
    `/conversations/${id}`,
    body
  );

  return responseData;
}
