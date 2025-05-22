import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  IRequestOptions,
} from "n8n-workflow";

export class Superchat implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Superchat",
    name: "superchat",
    icon: "file:superchat.svg",
    documentationUrl: "https://developers.superchat.com/",
    group: ["transform"],
    version: 1,
    subtitle:
      '={{$parameter["resource"].toTitleCase() + ": " + $parameter["operation"].toTitleCase()}}',
    description: "Retrieve data from the Superchat API",
    defaults: {
      name: "Superchat",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "superchatApi",
        required: true,
      },
    ],

    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        options: [
          {
            name: "User",
            value: "user",
            description: "A Superchat user",
          },
        ],
        default: "user",
        noDataExpression: true,
        required: true,
      },
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        required: true,
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["user"],
          },
        },
        options: [
          {
            value: "me",
            name: "Identify Yourself",
            action:
              "Retrieve the information about yourself as a superchat user",
          },
        ],
        default: "me",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    let responseData;
    const returnData = [];
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    for (let i = 0; i < items.length; i++) {
      if (resource === "user") {
        if (operation === "me") {
          const options: IRequestOptions = {
            headers: {
              Accept: "application/json",
            },
            method: "GET",
            body: {},
            uri: `https://api.superchat.com/v1.0/me`,
            json: true,
          };

          responseData = await this.helpers.requestWithAuthentication.call(
            this,
            "superchatApi",
            options
          );

          returnData.push(responseData);
        }
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
