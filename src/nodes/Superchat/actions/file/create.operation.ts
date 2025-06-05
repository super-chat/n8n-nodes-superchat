import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { FileOperationKey } from "./File.resource";
import { superchatFormDataApiRequest } from "../../GenericFunctions";

const properties: INodeProperties[] = [
  {
    displayName: "Input Data Field Name",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    required: true,
    description:
      "The name of the input field containing the binary file data to be uploaded",
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["file" satisfies ResourceKey],
      operation: ["create" satisfies FileOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const binaryPropertyName = this.getNodeParameter("binaryPropertyName", i);
  const { fileName, mimeType } = this.helpers.assertBinaryData(
    i,
    binaryPropertyName
  );
  const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(
    i,
    binaryPropertyName
  );

  const body = {
    file: {
      value: binaryDataBuffer,
      options: {
        filename: fileName,
        contentType: mimeType,
      },
    },
  };

  const responseData = await superchatFormDataApiRequest.call(
    this,
    "POST",
    "/files",
    body
  );

  returnData.push(responseData);

  return returnData;
}
