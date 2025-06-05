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

const properties: INodeProperties[] = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the conversation",
  },
  {
    displayName: "Labels",
    name: "labelIds",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add Label",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "ID",
            name: "id",
            type: "string",
            default: "",
            description: "A label ID",
          },
        ],
      },
    ],
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["conversation" satisfies ResourceKey],
      operation: ["updateLabels" satisfies ConversationOperationKey],
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
  const labelIds = this.getNodeParameter("labelIds", i) as {
    values: { id: string }[];
  };

  const body = {
    labels: labelIds.values.map(({ id }) => id),
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
