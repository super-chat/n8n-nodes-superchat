import type {
  INodeExecutionData,
  INodeProperties,
  IExecuteFunctions,
} from "n8n-workflow";
import { superchatApiRequest } from "../../GenericFunctions";

export const description: INodeProperties[] = [];

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const responseData = await superchatApiRequest.call(this, "GET", "/me", {});
  returnData.push(responseData);

  return returnData;
}
