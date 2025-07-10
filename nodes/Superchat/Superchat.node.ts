import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";
import { LIST_SEARCH_METHODS } from "../../utils/definitions";
import { createTypesafeParameterGetter } from "../../utils/magic";
import { assertUnreachable } from "../../utils/typescript";
import * as ContactResource from "./actions/contact/Contact.resource";
import { ContactOperationKey } from "./actions/contact/Contact.resource";
import * as ContactCreateOperation from "./actions/contact/create.operation";
import * as ContactDeleteOperation from "./actions/contact/delete.operation";
import * as ContactListConversationsOperation from "./actions/contact/listConversations.operation";
import * as ContactSearchOperation from "./actions/contact/search.operation";
import * as ContactUpdateOperation from "./actions/contact/update.operation";
import * as ConversationResource from "./actions/conversation/Conversation.resource";
import { ConversationOperationKey } from "./actions/conversation/Conversation.resource";
import * as ConversationDeleteOperation from "./actions/conversation/delete.operation";
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
import { getCustomContactAttributeFields } from "./methods/resourceMapping/getCustomContactAttributeFields";

const RESOURCE_OPTIONS = [
  {
    name: "User",
    value: "user",
    description: "A user",
  },
  {
    name: "Contact",
    value: "contact",
    description: "A contact",
  },
  {
    name: "Message",
    value: "message",
    description: "A message",
  },
  {
    name: "Conversation",
    value: "conversation",
    description: "A conversation",
  },
  {
    name: "Note",
    value: "note",
    description: "A note",
  },
  {
    name: "File",
    value: "file",
    description: "A file",
  },
] as const;

export type ResourceKey = (typeof RESOURCE_OPTIONS)[number]["value"];

export type OperationKeyByResource<R extends ResourceKey> = {
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

export const RESOURCE_MAPPING_METHODS = {
  getCustomContactAttributeFields,
} as const;

export type ResourceMappingFunction = keyof typeof RESOURCE_MAPPING_METHODS;

const properties = [
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
] as const satisfies INodeProperties[];

export class Superchat implements INodeType {
  methods = {
    listSearch: LIST_SEARCH_METHODS,
    resourceMapping: RESOURCE_MAPPING_METHODS,
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
    inputs: ["main" satisfies NodeConnectionType],
    outputs: ["main" satisfies NodeConnectionType],
    credentials: [
      {
        name: "superchatApi",
        required: true,
      },
    ],

    properties: properties,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const getNodeParameter = createTypesafeParameterGetter(properties);

    const items = this.getInputData();
    const returnData: any[] = [];

    const resource = getNodeParameter(this, "resource", 0);

    const identifier = (() => {
      if (resource === "user") {
        return getIdentifierForResource(resource, this.getNodeParameter);
      }
      if (resource === "message") {
        return getIdentifierForResource(resource, this.getNodeParameter);
      }
      if (resource === "contact") {
        return getIdentifierForResource(resource, this.getNodeParameter);
      }
      if (resource === "conversation") {
        return getIdentifierForResource(resource, this.getNodeParameter);
      }
      if (resource === "file") {
        return getIdentifierForResource(resource, this.getNodeParameter);
      }
      if (resource === "note") {
        return getIdentifierForResource(resource, this.getNodeParameter);
      }

      return assertUnreachable(resource);
    })();

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
        "conversation:delete": ConversationDeleteOperation.execute,
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
