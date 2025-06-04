import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";
import { superchatApiRequest } from "../../GenericFunctions";

const properties: INodeProperties[] = [
  {
    displayName: "Search Field",
    name: "field",
    type: "options",
    options: [
      {
        name: "Email Address",
        value: "mail",
        description: "Search by email address",
      },
      {
        name: "Phone Number",
        value: "phone",
        description: "Search by phone number",
      },
      {
        name: "Instagram Handle",
        value: "instagram",
        description: "Search by Instagram handle",
      },
    ],
    default: "mail",
    required: true,
    description: "Field to search by",
  },
  {
    displayName: "Value",
    name: "value",
    type: "string",
    default: "",
    required: true,
    description: "Value to search for",
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["contact" satisfies ResourceKey],
      operation: ["search" satisfies ContactOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const field = this.getNodeParameter("field", i) as string;
  const value = this.getNodeParameter("value", i) as string;

  const responseData = await superchatApiRequest.call(
    this,
    "POST",
    "/contacts/search",
    {
      query: {
        value: [
          {
            field,
            operator: "=",
            value,
          },
        ],
      },
    }
  );
  returnData.push(responseData);

  return returnData;
}
