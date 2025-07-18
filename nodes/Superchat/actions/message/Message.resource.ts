import type { INodeProperties } from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import * as sendMailOperation from "./sendMail.operation";
import * as sendMessageOperation from "./sendMessage.operation";
import * as sendWhatsAppTemplateOperation from "./sendWhatsAppTemplate.operation";

const MESSAGE_OPERATION_OPTIONS = [
  {
    value: "sendMessage",
    name: "Send Message",
    action: "Send a message",
  },
  {
    value: "sendMail",
    name: "Send Email",
    action: "Send an email",
  },
  {
    value: "sendWhatsAppTemplate",
    name: "Send WhatsApp Template",
    action: "Send a WhatsApp template",
  },
] as const;

export type MessageOperationKey =
  (typeof MESSAGE_OPERATION_OPTIONS)[number]["value"];

const OPERATION_DESCRIPTIONS: Record<MessageOperationKey, INodeProperties[]> = {
  sendMessage: sendMessageOperation.description,
  sendWhatsAppTemplate: sendWhatsAppTemplateOperation.description,
  sendMail: sendMailOperation.description,
};

export const description: INodeProperties[] = [
  // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    required: true,
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ["message" satisfies ResourceKey],
      },
    },
    options: [...MESSAGE_OPERATION_OPTIONS],
    default: "sendMessage" satisfies MessageOperationKey,
  },

  ...Object.values(OPERATION_DESCRIPTIONS).flat(),
];
