import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PAUpdateConversationDTO } from "../../../../types/PAUpdateConversationDTO";
import { SearchFunction } from "../../../../utils/definitions";
import { createTypesafeParameterGetter } from "../../../../utils/magic";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { ConversationOperationKey } from "./Conversation.resource";

const properties = [
  {
    displayName: "Conversation ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    placeholder: "e.g. cv_1234567890",
    description: "Conversation IDs start with 'cv_'",
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
            displayName: "User",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "A user",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter a User ID",
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
] as const satisfies INodeProperties[];

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
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const id = getNodeParameter(this, "id", i);
  const assignedUserIdsParamValue = getNodeParameter(
    this,
    "assignedUserIds",
    i
  );

  const assignedUserIds = (assignedUserIdsParamValue.values ?? []).flatMap(
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

  return responseData;
}
