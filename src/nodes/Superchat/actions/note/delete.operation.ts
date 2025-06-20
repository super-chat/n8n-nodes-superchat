import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { createTypesafeParameterGetter } from "../../../../magic";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { NoteOperationKey } from "./Note.resource";

const properties = [
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
] as const satisfies INodeProperties[];

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
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const returnData: INodeExecutionData[] = [];

  const conversationId = getNodeParameter(this, "conversationId", i);
  const noteId = getNodeParameter(this, "noteId", i);

  const responseData = await superchatJsonApiRequest.call(
    this,
    "DELETE",
    `/conversations/${conversationId}/notes/${noteId}`,
    {}
  );
  returnData.push(responseData);

  return returnData;
}
