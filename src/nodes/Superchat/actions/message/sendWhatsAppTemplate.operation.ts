import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { MessageOperationKey } from "./Message.resource";
import { superchatJsonApiRequest } from "../../GenericFunctions";
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
    type: "string",
    default: "",
    description: "The ID of the channel to send the message from",
    required: true,
  },
  {
    displayName: "Template ID",
    name: "templateId",
    type: "string",
    default: "",
    description: "The ID of the WhatsApp template you want to use",
    required: true,
  },
  {
    displayName: "Header File ID",
    name: "headerFileId",
    type: "string",
    default: "",
    description:
      "The ID of the file you want to use as a header in the template (Only set this if the template has a header)",
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
            hint: "The amount of variables must match the template definition",
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
  const channelId = this.getNodeParameter("channelId", i) as string;
  const templateId = this.getNodeParameter("templateId", i) as string;
  const headerFileId = this.getNodeParameter("headerFileId", i) as string;
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
