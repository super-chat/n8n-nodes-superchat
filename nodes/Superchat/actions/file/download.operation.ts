import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { createTypesafeParameterGetter } from "../../../../utils/magic";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";
import { FileOperationKey } from "./File.resource";

const properties = [
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
] as const satisfies INodeProperties[];

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
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const id = getNodeParameter(this, "id", i);
  const output = getNodeParameter(this, "output", i);

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

  return newItem;
}
