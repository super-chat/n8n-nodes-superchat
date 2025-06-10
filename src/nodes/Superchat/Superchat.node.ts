import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";
import { match } from "ts-pattern";
import * as ContactResource from "./actions/contact/Contact.resource";
import { ContactOperationKey } from "./actions/contact/Contact.resource";
import * as ContactCreateOperation from "./actions/contact/create.operation";
import * as ContactDeleteOperation from "./actions/contact/delete.operation";
import * as ContactListConversationsOperation from "./actions/contact/listConversations.operation";
import * as ContactSearchOperation from "./actions/contact/search.operation";
import * as ContactUpdateOperation from "./actions/contact/update.operation";
import * as ConversationResource from "./actions/conversation/Conversation.resource";
import { ConversationOperationKey } from "./actions/conversation/Conversation.resource";
import * as ConversationGetOperation from "./actions/conversation/get.operation";
import * as ConversationUpdateAssigneesOperation from "./actions/conversation/updateAssignees.operation";
import * as ConversationUpdateLabelsOperation from "./actions/conversation/updateLabels.operation";
import * as ConversationUpdateStatusOperation from "./actions/conversation/updateStatus.operation";
import * as FileCreateOperation from "./actions/file/create.operation";
import * as FileDeleteOperation from "./actions/file/delete.operation";
import * as FileDownloadOperation from "./actions/file/download.operation";
import * as FileResource from "./actions/file/File.resource";
import { FileOperationKey } from "./actions/file/File.resource";
import * as MessageResource from "./actions/message/Message.resource";
import { MessageOperationKey } from "./actions/message/Message.resource";
import * as MessageSendMailOperation from "./actions/message/sendMail.operation";
import * as MessageSendMessageOperation from "./actions/message/sendMessage.operation";
import * as MessageSendWhatsAppTemplateOperation from "./actions/message/sendWhatsAppTemplate.operation";
import * as NoteCreateOperation from "./actions/note/create.operation";
import * as NoteDeleteOperation from "./actions/note/delete.operation";
import * as NoteGetOperation from "./actions/note/get.operation";
import * as NoteResource from "./actions/note/Note.resource";
import { NoteOperationKey } from "./actions/note/Note.resource";
import * as UserMeOperation from "./actions/user/me.operation";
import * as UserResource from "./actions/user/User.resource";
import { UserOperationKey } from "./actions/user/User.resource";
import { customAttributeSearch } from "./methods/customAttributeSearch";
import { fileSearch } from "./methods/fileSearch";
import { inboxSearch } from "./methods/inboxSearch";
import { labelSearch } from "./methods/labelSearch";
import { messageChannelSearch } from "./methods/messageChannelSearch";
import { templateSearch } from "./methods/templateSearch";
import { userSearch } from "./methods/userSearch";

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
  {
    name: "File",
    value: "file",
    description: "A file in Superchat",
  },
] as const;

export type ResourceKey = (typeof RESOURCE_OPTIONS)[number]["value"];

type OperationKeyByResource<R extends ResourceKey> = {
  user: UserOperationKey;
  contact: ContactOperationKey;
  message: MessageOperationKey;
  conversation: ConversationOperationKey;
  note: NoteOperationKey;
  file: FileOperationKey;
}[R];

const RESOURCE_PROPERTIES: Record<ResourceKey, INodeProperties[]> = {
  user: UserResource.description,
  contact: ContactResource.description,
  message: MessageResource.description,
  conversation: ConversationResource.description,
  note: NoteResource.description,
  file: FileResource.description,
};

function getIdentifierForResource<R extends ResourceKey>(
  resource: R,
  getNodeParameter: IExecuteFunctions["getNodeParameter"]
) {
  const operation = getNodeParameter(
    "operation",
    0
  ) as OperationKeyByResource<R>;
  return `${resource}:${operation}` as const;
}

export const LIST_SEARCH_METHODS = {
  templateSearch,
  messageChannelSearch,
  inboxSearch,
  userSearch,
  labelSearch,
  fileSearch,
  customAttributeSearch,
} as const;

export type SearchFunction = keyof typeof LIST_SEARCH_METHODS;

export class Superchat implements INodeType {
  methods = {
    listSearch: LIST_SEARCH_METHODS,
  };

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

    const identifier = match(resource)
      .with("user", (resource) => {
        return getIdentifierForResource(resource, this.getNodeParameter);
      })
      .with("message", (resource) => {
        return getIdentifierForResource(resource, this.getNodeParameter);
      })
      .with("contact", (resource) => {
        return getIdentifierForResource(resource, this.getNodeParameter);
      })
      .with("conversation", (resource) => {
        return getIdentifierForResource(resource, this.getNodeParameter);
      })
      .with("file", (resource) => {
        return getIdentifierForResource(resource, this.getNodeParameter);
      })
      .with("note", (resource) => {
        return getIdentifierForResource(resource, this.getNodeParameter);
      })
      .exhaustive();

    const execute = (
      {
        "user:me": UserMeOperation.execute,
        "message:sendMessage": MessageSendMessageOperation.execute,
        "message:sendMail": MessageSendMailOperation.execute,
        "message:sendWhatsAppTemplate":
          MessageSendWhatsAppTemplateOperation.execute,
        "contact:search": ContactSearchOperation.execute,
        "contact:create": ContactCreateOperation.execute,
        "contact:delete": ContactDeleteOperation.execute,
        "contact:update": ContactUpdateOperation.execute,
        "contact:listConversations": ContactListConversationsOperation.execute,
        "conversation:get": ConversationGetOperation.execute,
        "conversation:updateLabels": ConversationUpdateLabelsOperation.execute,
        "conversation:updateStatus": ConversationUpdateStatusOperation.execute,
        "conversation:updateAssignees":
          ConversationUpdateAssigneesOperation.execute,
        "note:create": NoteCreateOperation.execute,
        "note:get": NoteGetOperation.execute,
        "note:delete": NoteDeleteOperation.execute,
        "file:create": FileCreateOperation.execute,
        "file:delete": FileDeleteOperation.execute,
        "file:download": FileDownloadOperation.execute,
      } as const
    )[identifier];

    for (let i = 0; i < items.length; i++) {
      const result = await execute.call(this, i);
      returnData.push(result);
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
