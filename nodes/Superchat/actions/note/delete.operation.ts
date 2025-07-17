import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { createTypesafeParameterGetter } from "../../../../utils/magic";
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
    description:
      "The ID of the conversation the note belongs to. Conversation IDs start with 'cv_'.",
    placeholder: "e.g. cv_1234567890",
  },
  {
    displayName: "Note ID",
    name: "noteId",
    type: "string",
    default: "",
    required: true,
    description: "Note IDs start with 'no_'",
    placeholder: "e.g. no_1234567890",
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
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const conversationId = getNodeParameter(this, "conversationId", i);
  const noteId = getNodeParameter(this, "noteId", i);

  await superchatJsonApiRequest.call(
    this,
    "DELETE",
    `/conversations/${conversationId}/notes/${noteId}`,
    {}
  );

  return { json: { deleted: true } };
}
