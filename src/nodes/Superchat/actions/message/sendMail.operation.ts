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
    displayName: "To (Email Address or Contact ID)",
    name: "identifier",
    type: "string",
    default: "",
    description: "Should be either an email address, or a Contact ID",
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
    displayName: "Subject",
    name: "subject",
    type: "string",
    default: "",
    description: "The subject of the email. Optional, but recommended.",
  },
  {
    displayName: "HTML",
    name: "html",
    type: "string",
    default: "",
    description: "At least one of HTML or Text needs to be provided",
  },
  {
    displayName: "Text",
    name: "text",
    type: "string",
    default: "",
    description: "At least one of HTML or Text needs to be provided",
  },
  {
    displayName: "Attachments (File IDs)",
    name: "fileIds",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add File",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Value",
            name: "value",
            type: "string",
            default: "",
            description: "A file ID",
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
      operation: ["sendMail" satisfies MessageOperationKey],
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
  const html = this.getNodeParameter("html", i) as string;
  const text = this.getNodeParameter("text", i) as string;
  const subject = this.getNodeParameter("subject", i) as string;
  const fileIds = this.getNodeParameter("fileIds", i) as {
    values: { value: string }[];
  };

  const body = {
    to: [{ identifier }],
    from: {
      channel_id: channelId,
      name: senderName,
    },
    content: {
      type: "email",
      subject: subject === "" ? undefined : subject,
      text: text === "" ? undefined : text,
      html: html === "" ? undefined : html,
      files: fileIds.values.map(({ value: fileId }) => ({ id: fileId })),
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
