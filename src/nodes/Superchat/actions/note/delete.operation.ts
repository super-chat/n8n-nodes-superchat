import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { NoteOperationKey } from "./Note.resource";

const properties: INodeProperties[] = [
  {
    displayName: "Conversation ID",
    name: "conversationId",
    type: "string",
    default: "",
    required: true,
    description: "ID of the conversation the note belongs to",
  },
  {
    displayName: "Note ID",
    name: "noteId",
    type: "string",
    default: "",
    required: true,
    description: "ID of the note",
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["note" satisfies ResourceKey],
      operation: ["delete" satisfies NoteOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const conversationId = this.getNodeParameter("conversationId", i) as string;
  const noteId = this.getNodeParameter("noteId", i) as string;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "DELETE",
    `/conversations/${conversationId}/notes/${noteId}`,
    {}
  );
  returnData.push(responseData);

  return returnData;
}
