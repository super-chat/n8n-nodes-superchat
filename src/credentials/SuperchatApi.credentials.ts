import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";
import { BASE_URL } from "../shared";

export class SuperchatApi implements ICredentialType {
  name = "superchatApi";
  displayName = "Superchat API";
  icon = "file:superchat.svg" as const;

  documentationUrl =
    "https://developers.superchat.com/reference/authentication";

  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        "X-API-KEY": "={{$credentials.apiKey}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: BASE_URL,
      url: "/me",
    },
  };
}
