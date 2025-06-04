import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
} from "n8n-workflow";
import { match } from "ts-pattern";
import * as ContactResource from "./actions/contact/Contact.resource";
import * as UserResource from "./actions/user/User.resource";
import { ContactOperationKey } from "./actions/contact/Contact.resource";
import { UserOperationKey } from "./actions/user/User.resource";
import * as UserMeOperation from "./actions/user/me.operation";
import * as ContactSearchOperation from "./actions/contact/search.operation";
import * as ContactCreateOperation from "./actions/contact/create.operation";
import * as ContactDeleteOperation from "./actions/contact/delete.operation";
import * as ContactUpdateOperation from "./actions/contact/update.operation";
import * as ContactListConversationsOperation from "./actions/contact/listConversations.operation";

const RESOURCE_OPTIONS = [
  {
    name: "User",
    value: "user",
    description: "A Superchat user",
  },
  {
    name: "Contact",
    value: "contact",
    description: "A Superchat contact",
  },
] as const;

export type ResourceKey = (typeof RESOURCE_OPTIONS)[number]["value"];

type OperationKeyByResource<R extends ResourceKey> = {
  user: UserOperationKey;
  contact: ContactOperationKey;
}[R];

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
      // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        options: [...RESOURCE_OPTIONS],
        default: "user" satisfies ResourceKey,
        noDataExpression: true,
        required: true,
      },

      ...ContactResource.description,
      ...UserResource.description,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: any[] = [];

    const resource = this.getNodeParameter("resource", 0) as ResourceKey;

    for (let i = 0; i < items.length; i++) {
      await match(resource)
        .with("user", async (resource) => {
          const operation = this.getNodeParameter(
            "operation",
            0
          ) as OperationKeyByResource<typeof resource>;

          await match(operation)
            .with("me", async () => {
              const result = await UserMeOperation.execute.call(this, i);
              returnData.push(result);
            })
            .exhaustive();
        })
        .with("contact", async (resource) => {
          const operation = this.getNodeParameter(
            "operation",
            0
          ) as OperationKeyByResource<typeof resource>;

          await match(operation)
            .with("search", async () => {
              const result = await ContactSearchOperation.execute.call(this, i);
              returnData.push(result);
            })
            .with("delete", async () => {
              const result = await ContactDeleteOperation.execute.call(this, i);
              returnData.push(result);
            })
            .with("create", async () => {
              const result = await ContactCreateOperation.execute.call(this, i);
              returnData.push(result);
            })
            .with("update", async () => {
              const result = await ContactUpdateOperation.execute.call(this, i);
              returnData.push(result);
            })
            .with("listConversations", async () => {
              const result =
                await ContactListConversationsOperation.execute.call(this, i);
              returnData.push(result);
            })
            .exhaustive();
        })
        .exhaustive();
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
