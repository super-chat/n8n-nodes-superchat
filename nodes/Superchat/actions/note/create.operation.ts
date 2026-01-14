import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PACreateNoteDTO } from "../../../../types/PACreateNoteDTO";
import { SearchFunction } from "../../../../utils/definitions";
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
    description:
      "The ID of the conversation to create the note in. Conversation IDs start with 'cv_'.",
    placeholder: "e.g. cv_1234567890",
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
  {
    displayName: "Attachments (File IDs)",
    name: "fileIds",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "e.g. fi_1234567890",
    description: "Link files that were uploaded via the File resource",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "File",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "A previously uploaded file",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter a File ID",
              },
              {
                displayName: "List",
                name: "list",
                type: "list",
                typeOptions: {
                  searchListMethod: "fileSearch" satisfies SearchFunction,
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
      resource: ["note" satisfies ResourceKey],
      operation: ["create" satisfies NoteOperationKey],
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
  const content = getNodeParameter(this, "content", i);
  const fileIdsParamValue = getNodeParameter(this, "fileIds", i);

  const fileIds = (fileIdsParamValue.values ?? []).flatMap(
    ({ id: { value } }) => (typeof value === "string" ? [value] : [])
  );

  const body = {
    content,
    file_ids: fileIds.length > 0 ? fileIds : undefined,
  } satisfies PACreateNoteDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "POST",
    `/conversations/${conversationId}/notes`,
    body
  );

  return responseData;
}
