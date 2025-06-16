import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PAUpdateConversationDTO } from "../../../../types/PAUpdateConversationDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey, SearchFunction } from "../../Superchat.node";
import { ConversationOperationKey } from "./Conversation.resource";

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
            type: "resourceLocator",
            default: "",
            description: "A label ID",
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
                  searchListMethod: "labelSearch" satisfies SearchFunction,
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

  const responseData = await superchatJsonApiRequest.call(
    this,
    "PATCH",
    `/conversations/${id}`,
    body
  );

  returnData.push(responseData);

  return returnData;
}
