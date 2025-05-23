import {
  IHookFunctions,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IDataObject,
  IRequestOptions,
  NodeApiError,
  JsonObject,
} from "n8n-workflow";
import { BASE_URL, N8N_VERSION, NODE_VERSION } from "../../shared";

/**
 * Make an API request to Superchat
 */
export async function superchatApiRequest(
  this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject,
  query?: IDataObject,
  dataKey?: string
): Promise<any> {
  if (query === undefined) {
    query = {};
  }

  const options: IRequestOptions = {
    headers: {
      Accept: "application/json",
      "X-Superchat-Platform": "n8n",
      "X-Superchat-n8n-Version": N8N_VERSION,
      "X-Superchat-n8n-Node-Version": NODE_VERSION,
    },
    method,
    qs: query,
    uri: `${BASE_URL}${endpoint}`,
    json: true,
  };

  if (Object.keys(body).length > 0) {
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
