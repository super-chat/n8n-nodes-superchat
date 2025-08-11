import {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  ILoadOptionsFunctions,
  IRequestOptions,
  JsonObject,
  NodeApiError,
} from "n8n-workflow";
import { BASE_URL, NODE_VERSION } from "../../utils/shared";

function getBaseHeaders(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions
) {
  return {
    "X-Superchat-Platform": "n8n",
    "X-Superchat-n8n-Node-Version": NODE_VERSION,
    "X-Superchat-n8n-Instance-Id": this.getInstanceId(),
    "X-Superchat-n8n-Node-Id": this.getNode().id,
    "X-Superchat-n8n-Execution-Id": this.getExecutionId(),
    "X-Superchat-n8n-Workflow-Id": this.getWorkflow().id,
  };
}

/**
 * Make an API request with a multipart/form-data body to Superchat
 */
export async function superchatFormDataApiRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject
): Promise<any> {
  const options: IRequestOptions = {
    headers: {
      ...getBaseHeaders.call(this),
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    method,
    uri: `${BASE_URL}${endpoint}`,
    json: true,
    body,
  };

  try {
    const responseData = await this.helpers.requestWithAuthentication.call(
      this,
      "superchatApi",
      options
    );

    if (responseData.success === false) {
      throw new NodeApiError(this.getNode(), responseData as JsonObject);
    }

    return responseData;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

/**
 * Make an API request with a json body to Superchat.
 */
export async function superchatJsonApiRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  dataKey?: string
): Promise<any> {
  if (query === undefined) {
    query = {};
  }

  const options: IRequestOptions = {
    headers: {
      ...getBaseHeaders.call(this),
      Accept: "application/json",
    },
    method,
    qs: query,
    uri: `${BASE_URL}${endpoint}`,
    json: body && "formData" in body ? false : true,
  };

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  try {
    const responseData = await this.helpers.requestWithAuthentication.call(
      this,
      "superchatApi",
      options
    );

    if (responseData.success === false) {
      throw new NodeApiError(this.getNode(), responseData as JsonObject);
    }

    if (dataKey === undefined) {
      return responseData;
    } else {
      return responseData[dataKey] as IDataObject;
    }
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}
