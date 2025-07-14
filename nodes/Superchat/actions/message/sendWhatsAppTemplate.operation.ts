import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PASendMessageDTO } from "../../../../types/PASendMessageDTO";
import { SearchFunction } from "../../../../utils/definitions";
import { createTypesafeParameterGetter } from "../../../../utils/magic";
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
    displayName: "To (Phone Number or Contact ID)",
    name: "identifier",
    type: "string",
    default: "",
    description: "Should be either a phone number or a Contact ID",
    required: true,
    placeholder: "e.g. +4915212345678",
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
  {
    displayName: "Options",
    name: "otherOptions",
    type: "collection",
    default: {},
    description: "Other options to set",
    placeholder: "Add option",
    options: [
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
    ],
  },
] as const satisfies INodeProperties[];

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
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const senderName = getNodeParameter(this, "senderName", i);
  const identifier = getNodeParameter(this, "identifier", i);
  const channelId = getNodeParameter(this, "channelId", i).value as string;
  const templateId = getNodeParameter(this, "templateId", i).value as string;
  const variables = getNodeParameter(this, "variables", i);

  const otherOptions = getNodeParameter(this, "otherOptions", i);
  const headerFileId = otherOptions.headerFileId?.value as string | undefined;

  const body = {
    to: [{ identifier }],
    from: {
      channel_id: channelId,
      name: senderName,
    },
    content: {
      type: "whats_app_template",
      template_id: templateId,
      file:
        headerFileId === undefined || headerFileId === ""
          ? undefined
          : { id: headerFileId },
      variables: (variables.values ?? []).map((v, i) => ({
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

  return responseData;
}
