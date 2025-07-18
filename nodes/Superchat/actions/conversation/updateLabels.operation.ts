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
            displayName: "Label",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "A label",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter a Label ID",
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
] as const satisfies INodeProperties[];

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
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const id = getNodeParameter(this, "id", i);
  const labelIdsParamValue = getNodeParameter(this, "labelIds", i);

  const labelIds = (labelIdsParamValue.values ?? []).flatMap(
    ({ id: { value } }) => (typeof value === "string" ? [value] : [])
  );

  const body = {
    labels: labelIds,
  } satisfies PAUpdateConversationDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "PATCH",
    `/conversations/${id}`,
    body
  );

  return responseData;
}
