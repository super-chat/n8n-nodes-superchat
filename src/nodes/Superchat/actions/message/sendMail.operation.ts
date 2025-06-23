import {
  type IExecuteFunctions,
  type INodeExecutionData,
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
      operation: ["sendMail" satisfies MessageOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const senderName = getNodeParameter(this, "senderName", i);
  const identifier = getNodeParameter(this, "identifier", i);
  const channelId = getNodeParameter(this, "channelId", i).value as string;
  const replyToMessageId = getNodeParameter(this, "replyToMessageId", i)
    .value as string;
  const html = getNodeParameter(this, "html", i);
  const text = getNodeParameter(this, "text", i);
  const subject = getNodeParameter(this, "subject", i);
  const fileIdsParamValue = getNodeParameter(this, "fileIds", i);

  const fileIds = (fileIdsParamValue.values ?? []).flatMap(
    ({ id: { value } }) => (typeof value === "string" ? [value] : [])
  );

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
      files: fileIds.map((fileId) => ({ id: fileId })),
    },
    in_reply_to: replyToMessageId === "" ? undefined : replyToMessageId,
  } satisfies PASendMessageDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "POST",
    "/messages",
    body
  );

  return responseData;
}
