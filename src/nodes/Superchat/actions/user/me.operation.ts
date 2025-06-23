import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { UserOperationKey } from "./User.resource";

const properties: INodeProperties[] = [];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["user" satisfies ResourceKey],
      operation: ["me" satisfies UserOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData> {
  const responseData = await superchatJsonApiRequest.call(
    this,
    "GET",
    "/me",
    {}
  );

  return responseData;
}
