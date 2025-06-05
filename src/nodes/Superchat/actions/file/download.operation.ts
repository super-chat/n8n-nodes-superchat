import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { FileOperationKey } from "./File.resource";
import { superchatJsonApiRequest } from "../../GenericFunctions";

const properties: INodeProperties[] = [
  {
    displayName: "ID",
    name: "id",
    type: "string",
    default: "",
    required: true,
    description: "ID of the file to delete",
  },
  {
    displayName: "Put Output In Field",
    name: "output",
    type: "string",
    default: "data",
    required: true,
    description: "The name of the output field to put the binary file data in",
    displayOptions: {
      show: {
        operation: ["download"],
        resource: ["file"],
      },
    },
  },
];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["file" satisfies ResourceKey],
      operation: ["download" satisfies FileOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const id = this.getNodeParameter("id", i) as string;
  const output = this.getNodeParameter("output", i) as string;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "GET",
    `/files/${id}`,
    {}
  );

  const downloadUrl = responseData["link"]["url"] as string;

  const response = await this.helpers.request.call(this, {
    method: "GET",
    uri: downloadUrl,
    encoding: null,
    json: false,
    resolveWithFullResponse: true,
  });

  let mimeType = response.headers["content-type"] as string | undefined;
  mimeType = mimeType
    ? mimeType.split(";").find((value) => value.includes("/"))
    : undefined;
  const contentDisposition = response.headers["content-disposition"];
  const fileNameRegex = /(?<=filename=").*\b/;
  const match = fileNameRegex.exec(contentDisposition as string);
  let fileName = "";

  // file name was found
  if (match !== null) {
    fileName = match[0];
  }

  const newItem: INodeExecutionData = {
    json: {},
    binary: {},
  };

  newItem.binary = {
    [output]: await this.helpers.prepareBinaryData(
      response.body as unknown,
      fileName,
      mimeType
    ),
  };

  return newItem as unknown as INodeExecutionData[];
}
