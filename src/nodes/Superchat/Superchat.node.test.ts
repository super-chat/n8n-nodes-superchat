import { beforeEach, expect, test } from "@jest/globals";
import { Superchat } from "./Superchat.node";
import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  IRequestOptions,
} from "n8n-workflow";

let node: Superchat;

beforeEach(() => {
  node = new Superchat();
});

test("should be defined", () => {
  expect(node).toBeDefined();
});

// https://github.com/linagora/n8n/blob/f4262ec9b6633eb5959b340b5b047ed14f6371b1/packages/core/src/NodeExecuteFunctions.ts#L254
export function returnJsonArray(
  jsonData: IDataObject | IDataObject[]
): INodeExecutionData[] {
  const returnData: INodeExecutionData[] = [];

  if (!Array.isArray(jsonData)) {
    jsonData = [jsonData];
  }

  jsonData.forEach((data) => {
    returnData.push({ json: data });
  });

  return returnData;
}

test("get current user", async () => {
  const mockExecuteFunctions: IExecuteFunctions = {
    getInputData: () => [{}],
    getNodeParameter: (resource: string) => {
      if (resource === "resource") {
        return "user";
      }

      if (resource === "operation") {
        return "me";
      }

      return "";
    },
    helpers: {
      returnJsonArray,

      async requestWithAuthentication(
        credentialsType: string,
        requestOptions: IRequestOptions
      ) {
        return { ok: true };
      },

      async getCredentials(name: string) {
        console.log(name);
      },
    },
    continueOnFail: () => false,
  } as unknown as IExecuteFunctions;

  // Execute the node function
  const result = await node.execute.call(mockExecuteFunctions);

  expect(result).toHaveLength(1);

  // TODO: Validate the response
});
