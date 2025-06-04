import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { MessageOperationKey } from "./Message.resource";
import { superchatApiRequest } from "../../GenericFunctions";
import { PASendMessageDTO } from "../../../../types/PASendMessageDTO";

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
    type: "string",
    default: "",
    description: "The ID of the channel to send the message from",
    required: true,
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
      operation: ["send" satisfies MessageOperationKey],
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

  const responseData = await superchatApiRequest.call(
    this,
    "POST",
    "/messages",
    body
  );
  returnData.push(responseData);

  return returnData;
}
