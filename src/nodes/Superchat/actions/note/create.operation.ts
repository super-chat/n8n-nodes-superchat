import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PACreateNoteDTO } from "../../../../types/PACreateNoteDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { NoteOperationKey } from "./Note.resource";

const properties: INodeProperties[] = [
  {
    displayName: "Conversation ID",
    name: "conversationId",
    type: "string",
    default: "",
    description: "The ID of the conversation to create the note in",
    required: true,
  },
  {
    displayName: "Content",
    name: "content",
    type: "string",
    default: "",
    description: "The content of the note",
    required: true,
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["note" satisfies ResourceKey],
      operation: ["create" satisfies NoteOperationKey],
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
  const content = this.getNodeParameter("content", i) as string;

  const body = {
    content,
  } satisfies PACreateNoteDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "POST",
    `/conversations/${conversationId}/notes`,
    body
  );
  returnData.push(responseData);

  return returnData;
}
