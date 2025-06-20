import {
  type IExecuteFunctions,
  type INodeExecutionData,
  INodeParameterResourceLocator,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { SearchFunction } from "../../../../definitions";
import { createTypesafeParameterGetter } from "../../../../magic";
import { PASendMessageDTO } from "../../../../types/PASendMessageDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { MessageOperationKey } from "./Message.resource";

const properties = [
  {
    displayName: "Sender Name",
    name: "senderName",
    type: "string",
    default: "Sent from n8n",
    description: "This value will be visible beneath the message in Superchat",
    required: true,
  },
  {
    displayName: "To (Identifier)",
    name: "identifier",
    type: "string",
    default: "",
    description:
      "Should be either a phone number, email address, or a Contact ID",
    required: true,
  },
  {
    displayName: "Channel ID",
    name: "channelId",
    type: "resourceLocator",
    default: { mode: "list" },
    description: "The ID of the channel to send the message from",
    required: true,
    modes: [
      {
        displayName: "ID",
        name: "id",
        type: "string",
        hint: "Enter an ID",
      },
      {
        displayName: "List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "messageChannelSearch" satisfies SearchFunction,
          searchable: false,
          searchFilterRequired: false,
        },
      },
    ],
  },
  {
    displayName: "Reply To (Message ID)",
    name: "replyToMessageId",
    type: "resourceLocator",
    default: { mode: "id" },
    description: "The ID of the message to reply to",
    modes: [
      {
        displayName: "ID",
        name: "id",
        type: "string",
        hint: "Enter an ID",
      },
    ],
  },
  {
    displayName: "Content",
    name: "content",
    placeholder: "Add content",
    type: "fixedCollection",
    default: {},
    typeOptions: {
      multipleValues: false,
      maxValues: 1,
    },
    options: [
      {
        name: "text",
        displayName: "Text",
        values: [
          {
            displayName: "Value",
            name: "value",
            type: "string",
            default: "The text content of the message",
          },
        ],
      },
      {
        name: "media",
        displayName: "Media",
        values: [
          {
            displayName: "File",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "A file",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter an ID",
              },
              {
                displayName: "List",
                name: "list",
                type: "list",
                typeOptions: {
                  searchListMethod: "fileSearch" satisfies SearchFunction,
                  searchable: false,
                  searchFilterRequired: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },
] as const satisfies INodeProperties[];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["message" satisfies ResourceKey],
      operation: ["sendMessage" satisfies MessageOperationKey],
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

  const senderName = getNodeParameter(this, "senderName", i);
  const identifier = getNodeParameter(this, "identifier", i);
  const channelId = getNodeParameter(this, "channelId", i).value as string;
  const replyToMessageId = getNodeParameter(this, "replyToMessageId", i)
    .value as string;

  const content = getNodeParameter(this, "content", i);

  const body = {
    to: [{ identifier }],
    from: {
      channel_id: channelId,
      name: senderName,
    },
    content:
      "text" in content
        ? {
            type: "text",
            body: (content.text?.value as string | undefined) ?? "",
          }
        : {
            type: "media",
            file_id:
              ((content.media?.id as INodeParameterResourceLocator | undefined)
                ?.value as string | undefined) ?? "",
          },
    in_reply_to: replyToMessageId === "" ? undefined : replyToMessageId,
  } satisfies PASendMessageDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "POST",
    "/messages",
    body
  );
  returnData.push(responseData);

  return returnData;
}
