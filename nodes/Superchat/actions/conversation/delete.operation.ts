import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
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
] as const satisfies INodeProperties[];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["conversation" satisfies ResourceKey],
      operation: ["delete" satisfies ConversationOperationKey],
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

  await superchatJsonApiRequest.call(
    this,
    "DELETE",
    `/conversations/${id}`,
    {}
  );

  return { json: { deleted: true } };
}
