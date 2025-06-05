import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PAUpdateConversationDTO } from "../../../../types/PAUpdateConversationDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
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
            type: "string",
            default: "",
            description: "A user ID",
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
  const assignedUserIds = this.getNodeParameter("assignedUserIds", i) as {
    values: { id: string }[];
  };

  const body = {
    assigned_users: assignedUserIds.values.map(({ id }) => id),
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
