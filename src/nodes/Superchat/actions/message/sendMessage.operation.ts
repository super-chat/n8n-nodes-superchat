import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PASendMessageDTO } from "../../../../types/PASendMessageDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey, SearchFunction } from "../../Superchat.node";
import { MessageOperationKey } from "./Message.resource";

const properties: INodeProperties[] = [
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
    default: "",
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
          searchable: true,
          searchFilterRequired: false,
        },
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
            displayName: "File ID",
            name: "fileId",
            type: "string",
            default: "The ID of the file to send",
          },
        ],
      },
    ],
  },
];

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
  const returnData: INodeExecutionData[] = [];

  const senderName = this.getNodeParameter("senderName", i) as string;
  const identifier = this.getNodeParameter("identifier", i) as string;
  const channelId = this.getNodeParameter("channelId", i) as string;
  const content = this.getNodeParameter("content", i) as
    | {
        text: { value: string };
      }
    | {
        media: { fileId: string };
      };

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
            body: content.text.value,
          }
        : {
            type: "media",
            file_id: content.media.fileId,
          },
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
