import {
  type IExecuteFunctions,
  type INodeExecutionData,
  INodeParameterResourceLocator,
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
    displayName: "Assigned Users",
    name: "assignedUserIds",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add User",
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
            default: { mode: "list" },
            description: "A user ID",
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
                  searchListMethod: "userSearch" satisfies SearchFunction,
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
      operation: ["updateAssignees" satisfies ConversationOperationKey],
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
  const assignedUserIdsParamValue = this.getNodeParameter(
    "assignedUserIds",
    i
  ) as {
    values: { id: INodeParameterResourceLocator }[];
  };

  const assignedUserIds = assignedUserIdsParamValue.values.flatMap(
    ({ id: { value } }) => (typeof value === "string" ? [value] : [])
  );

  const body = {
    assigned_users: assignedUserIds,
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
