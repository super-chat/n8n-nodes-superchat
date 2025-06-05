import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
  INodeProperties,
} from "n8n-workflow";
import { match } from "ts-pattern";
import * as ContactResource from "./actions/contact/Contact.resource";
import * as UserResource from "./actions/user/User.resource";
import * as MessageResource from "./actions/message/Message.resource";
import * as ConversationResource from "./actions/conversation/Conversation.resource";
import * as NoteResource from "./actions/note/Note.resource";
import { ContactOperationKey } from "./actions/contact/Contact.resource";
import { UserOperationKey } from "./actions/user/User.resource";
import { MessageOperationKey } from "./actions/message/Message.resource";
import * as UserMeOperation from "./actions/user/me.operation";
import * as ContactSearchOperation from "./actions/contact/search.operation";
import * as ContactCreateOperation from "./actions/contact/create.operation";
import * as ContactDeleteOperation from "./actions/contact/delete.operation";
import * as ContactUpdateOperation from "./actions/contact/update.operation";
import * as ContactListConversationsOperation from "./actions/contact/listConversations.operation";
import * as MessageSendMessageOperation from "./actions/message/sendMessage.operation";
import * as MessageSendMailOperation from "./actions/message/sendMail.operation";
import * as ConversationGetOperation from "./actions/conversation/get.operation";
import * as ConversationUpdateLabelsOperation from "./actions/conversation/updateLabels.operation";
import * as ConversationUpdateStatusOperation from "./actions/conversation/updateStatus.operation";
import * as ConversationUpdateAssigneesOperation from "./actions/conversation/updateAssignees.operation";
import * as NoteCreateOperation from "./actions/note/create.operation";
import { ConversationOperationKey } from "./actions/conversation/Conversation.resource";
import { NoteOperationKey } from "./actions/note/Note.resource";

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
  {
    name: "Message",
    value: "message",
    description: "A message in Superchat",
  },
  {
    name: "Conversation",
    value: "conversation",
    description: "A conversation in Superchat",
  },
  {
    name: "Note",
    value: "note",
    description: "A note in Superchat",
  },
] as const;

export type ResourceKey = (typeof RESOURCE_OPTIONS)[number]["value"];

type OperationKeyByResource<R extends ResourceKey> = {
  user: UserOperationKey;
  contact: ContactOperationKey;
  message: MessageOperationKey;
  conversation: ConversationOperationKey;
  note: NoteOperationKey;
}[R];

const RESOURCE_PROPERTIES: Record<ResourceKey, INodeProperties[]> = {
  user: UserResource.description,
  contact: ContactResource.description,
  message: MessageResource.description,
  conversation: ConversationResource.description,
  note: NoteResource.description,
};

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

      ...Object.values(RESOURCE_PROPERTIES).flat(),
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
        .with("message", async (resource) => {
          const operation = this.getNodeParameter(
            "operation",
            0
          ) as OperationKeyByResource<typeof resource>;

          await match(operation)
            .with("sendMessage", async () => {
              const result = await MessageSendMessageOperation.execute.call(
                this,
                i
              );
              returnData.push(result);
            })
            .with("sendMail", async () => {
              const result = await MessageSendMailOperation.execute.call(
                this,
                i
              );
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
        .with("conversation", async (resource) => {
          const operation = this.getNodeParameter(
            "operation",
            0
          ) as OperationKeyByResource<typeof resource>;

          await match(operation)
            .with("get", async () => {
              const result = await ConversationGetOperation.execute.call(
                this,
                i
              );
              returnData.push(result);
            })
            .with("updateLabels", async () => {
              const result =
                await ConversationUpdateLabelsOperation.execute.call(this, i);
              returnData.push(result);
            })
            .with("updateStatus", async () => {
              const result =
                await ConversationUpdateStatusOperation.execute.call(this, i);
              returnData.push(result);
            })
            .with("updateAssignees", async () => {
              const result =
                await ConversationUpdateAssigneesOperation.execute.call(
                  this,
                  i
                );
              returnData.push(result);
            })
            .exhaustive();
        })
        .with("note", async (resource) => {
          const operation = this.getNodeParameter(
            "operation",
            0
          ) as OperationKeyByResource<typeof resource>;

          await match(operation)
            .with("create", async () => {
              const result = await NoteCreateOperation.execute.call(this, i);
              returnData.push(result);
            })
            .exhaustive();
        })
        .exhaustive();
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
