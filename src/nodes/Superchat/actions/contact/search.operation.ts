import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { PASearchContactDTO } from "../../../../types/PASearchContactDTO";
import { PASearchContactQueryExpression } from "../../../../types/PASearchContactQueryExpression";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";

const properties: INodeProperties[] = [
  // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
  {
    displayName: "Search Field",
    name: "field",
    type: "options",
    options: [
      {
        name: "Email Address",
        value: "mail" satisfies PASearchContactQueryExpression["field"],
        description: "Search by email address",
      },
      {
        name: "Phone Number",
        value: "phone" satisfies PASearchContactQueryExpression["field"],
        description: "Search by phone number",
      },
      {
        name: "Instagram Handle",
        value: "instagram" satisfies PASearchContactQueryExpression["field"],
        description: "Search by Instagram handle",
      },
    ],
    default: "mail" satisfies PASearchContactQueryExpression["field"],
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

  const field = this.getNodeParameter(
    "field",
    i
  ) as PASearchContactQueryExpression["field"];
  const value = this.getNodeParameter("value", i) as string;

  const body = {
    query: {
      value: [
        {
          field,
          operator: "=",
          value,
        },
      ],
    },
  } satisfies PASearchContactDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "POST",
    "/contacts/search",
    body
  );
  returnData.push(responseData);

  return returnData;
}
