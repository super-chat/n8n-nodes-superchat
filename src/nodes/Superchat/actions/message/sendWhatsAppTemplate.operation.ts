import {
  type IExecuteFunctions,
  type INodeExecutionData,
  INodeParameterResourceLocator,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { SearchFunction } from "../../../../definitions";
import { PASendMessageDTO } from "../../../../types/PASendMessageDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
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
    displayName: "To (Phone Number or Contact ID)",
    name: "identifier",
    type: "string",
    default: "",
    description: "Should be either a phone number or a Contact ID",
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
    displayName: "Template ID",
    name: "templateId",
    type: "resourceLocator",
    default: { mode: "list" },
    description: "The ID of the WhatsApp template you want to use",
    required: true,
    typeOptions: {
      loadOptionsDependsOn: ["channelId"],
    },
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
          searchListMethod: "templateSearch" satisfies SearchFunction,
          searchable: false,
          searchFilterRequired: false,
        },
      },
    ],
  },
  {
    displayName: "Header File ID",
    name: "headerFileId",
    type: "resourceLocator",
    default: { mode: "list" },
    description:
      "The ID of the file you want to use as a header in the template (Only set this if the template has a header)",
    typeOptions: {
      loadOptionsDependsOn: ["templateId"],
    },
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
  {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
    displayName: "Variables",
    name: "variables",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add Variable",
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
            description: "A variable value",
            hint: "The number and order of variables must match the template definition. Dynamic URL suffices are handled as variables, too.",
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
      operation: ["sendWhatsAppTemplate" satisfies MessageOperationKey],
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
  const channelId = (
    this.getNodeParameter("channelId", i) as INodeParameterResourceLocator
  ).value as string;
  const templateId = (
    this.getNodeParameter("templateId", i) as INodeParameterResourceLocator
  ).value as string;
  const headerFileId = (
    this.getNodeParameter("headerFileId", i) as INodeParameterResourceLocator
  ).value as string;
  const variables = this.getNodeParameter("variables", i) as {
    values: { value: string }[];
  };

  const body = {
    to: [{ identifier }],
    from: {
      channel_id: channelId,
      name: senderName,
    },
    content: {
      type: "whats_app_template",
      template_id: templateId,
      file: headerFileId === "" ? undefined : { id: headerFileId },
      variables: variables.values.map((v, i) => ({
        position: i,
        value: v.value,
      })),
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
