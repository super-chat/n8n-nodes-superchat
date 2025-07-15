import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { createTypesafeParameterGetter } from "../../../../utils/magic";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";

const properties = [
  {
    displayName: "Contact ID",
    name: "contactId",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. co_1234567890",
    description:
      "The ID of the contact whose conversations you want to list. Contact IDs start with 'co_'.",
  },
] as const satisfies INodeProperties[];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["contact" satisfies ResourceKey],
      operation: ["listConversations" satisfies ContactOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const contactId = getNodeParameter(this, "contactId", i);

  const responseData = await superchatJsonApiRequest.call(
    this,
    "GET",
    `/contacts/${contactId}/conversations`,
    {}
  );

  return responseData;
}
