import {
  type IHookFunctions,
  type IWebhookFunctions,
  type IDataObject,
  type INodeType,
  type INodeTypeDescription,
  type IWebhookResponseData,
  NodeConnectionType,
} from "n8n-workflow";
import { superchatJsonApiRequest } from "./GenericFunctions";
import { WebhookEventType } from "../../types/WebhookEventType";
import { match } from "ts-pattern";
import { WebhookEventWriteDTO } from "../../types/WebhookEventWriteDTO";
import { WebhookEventFilterWriteDTO } from "../../types/WebhookEventFilterWriteDTO";
import { ContactWriteDefaultAttributeField } from "../../types/ContactWriteDefaultAttributeField";

const TOPIC_OPTIONS = [
  {
    name: "Contact Created",
    value: "contact_created" satisfies WebhookEventType,
  },
  {
    name: "Contact Updated",
    value: "contact_updated" satisfies WebhookEventType,
  },
  {
    name: "Note Created",
    value: "note_created" satisfies WebhookEventType,
  },
  {
    name: "Inbound Message",
    value: "message_inbound" satisfies WebhookEventType,
  },
  {
    name: "Outbound Message",
    value: "message_outbound" satisfies WebhookEventType,
  },
  {
    name: "Failed Message",
    value: "message_failed" satisfies WebhookEventType,
  },
] as const;

export type Topic = (typeof TOPIC_OPTIONS)[number]["value"];

export class SuperchatTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Superchat Trigger",
    name: "superchatTrigger",
    icon: "file:superchat.svg",
    documentationUrl: "https://developers.superchat.com/",
    group: ["trigger"],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: "Handle Superchat events via webhooks",
    defaults: {
      name: "Superchat Trigger",
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "superchatApi",
        required: true,
      },
    ],
    webhooks: [
      {
        name: "default",
        httpMethod: "POST",
        responseMode: "onReceived",
        path: "webhook",
      },
    ],
    properties: [
      // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
      {
        displayName: "Trigger On",
        name: "topic",
        type: "options",
        default: "contact_created" satisfies WebhookEventType,
        options: [...TOPIC_OPTIONS],
      },

      {
        displayName: "Filter by Channel",
        name: "channelIds",
        type: "fixedCollection",
        default: { values: [] },
        placeholder: "Add Channel",
        description:
          "Only listen for inbound messages, outbound messages or failed messages on specified channels",
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: "Values",
            name: "values",
            values: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                default: "",
                description: "A channel ID",
                hint: "Only applicable for inbound message, outbound message or or failed message events",
              },
            ],
          },
        ],
      },

      {
        displayName: "Filter by Inbox",
        name: "inboxIds",
        type: "fixedCollection",
        default: { values: [] },
        placeholder: "Add Channel",
        description:
          "Only listen for inbound messages, outbound messages or failed messages on specified inboxes",
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: "Values",
            name: "values",
            values: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                default: "",
                description: "An inbox ID",
                hint: "Only applicable for inbound message, outbound message or failed message events",
              },
            ],
          },
        ],
      },

      {
        displayName: "Filter by Custom Attribute",
        name: "customAttributeIds",
        type: "fixedCollection",
        default: { values: [] },
        placeholder: "Add Custom Attribute",
        description:
          "Only listen for updated contacts based on the changed custom attributes",
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: "Values",
            name: "values",
            values: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                default: "",
                description: "A custom attribute ID",
                hint: "Only applicable for contact updated events",
              },
            ],
          },
        ],
      },

      // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
      {
        displayName: "Filter by Built-in Attribute",
        name: "builtinAttributes",
        type: "options",
        options: [
          {
            name: "Fist Name",
            value: "first_name" satisfies ContactWriteDefaultAttributeField,
          },
          {
            name: "Last Name",
            value: "last_name" satisfies ContactWriteDefaultAttributeField,
          },
          {
            name: "Gender",
            value: "gender" satisfies ContactWriteDefaultAttributeField,
          },
        ],
        default: "first_name" satisfies ContactWriteDefaultAttributeField,
        description:
          "Only listen for updated contacts based on the changed built-in attributes",
        typeOptions: {
          multipleValues: true,
        },
        hint: "Only applicable for contact updated events",
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl("default")!!;
        const webhookData = this.getWorkflowStaticData("node");
        const topic = this.getNodeParameter("topic") as WebhookEventType;

        const webhookId = webhookData.webhookId;

        if (!webhookId) {
          return false;
        }

        const data = await superchatJsonApiRequest.call(
          this,
          "GET",
          `/webhooks/${webhookId}`,
          {}
        );

        if (
          data.target_url === webhookUrl &&
          Array.isArray(data.events) &&
          data.events.some((event: any) => event.type === topic)
        ) {
          return true;
        }

        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData("node");
        const topic = this.getNodeParameter("topic") as Topic;
        const webhookUrl = this.getNodeWebhookUrl("default")!!;

        const event = match(topic)
          .with(
            "note_created",
            "contact_created",
            (type): WebhookEventWriteDTO => ({
              type,
              filters: [],
            })
          )
          .with("contact_updated", (type): WebhookEventWriteDTO => {
            const customAttributeIds = this.getNodeParameter(
              "customAttributeIds",
              ""
            ) as {
              values: { id: string }[];
            };
            const builtinAttributes = this.getNodeParameter(
              "builtinAttributes",
              ""
            ) as ContactWriteDefaultAttributeField[];

            const filters: WebhookEventFilterWriteDTO[] = [];

            if (customAttributeIds.values.length > 0) {
              filters.push({
                type: "custom_attribute",
                ids: customAttributeIds.values.map(({ id }) => id),
              });
            }

            if (builtinAttributes.length > 0) {
              filters.push({
                type: "default_attribute",
                attributes: builtinAttributes,
              });
            }

            return {
              type,
              filters,
            };
          })
          .with(
            "message_inbound",
            "message_outbound",
            "message_failed",
            (type): WebhookEventWriteDTO => {
              const channelIds = this.getNodeParameter("channelIds", "") as {
                values: { id: string }[];
              };

              const inboxIds = this.getNodeParameter("inboxIds", "") as {
                values: { id: string }[];
              };

              const filters: WebhookEventFilterWriteDTO[] = [];

              if (channelIds.values.length > 0) {
                filters.push({
                  type: "channel",
                  ids: channelIds.values.map(({ id }) => id),
                });
              }

              if (inboxIds.values.length > 0) {
                filters.push({
                  type: "inbox",
                  ids: inboxIds.values.map(({ id }) => id),
                });
              }

              return {
                type,
                filters,
              };
            }
          )
          .exhaustive();

        const body = {
          target_url: webhookUrl,
          events: [event],
        };

        const data = await superchatJsonApiRequest.call(
          this,
          "POST",
          `/webhooks`,
          body
        );

        if (!("id" in data)) {
          return false;
        }

        webhookData.webhookId = data.id as string;
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData("node");
        if (webhookData.webhookId !== undefined) {
          try {
            const data = await superchatJsonApiRequest.call(
              this,
              "DELETE",
              `/webhooks/${webhookData.webhookId}`,
              {}
            );

            if (!("id" in data)) {
              return false;
            }

            delete webhookData.webhookId;
            return true;
          } catch (error) {
            return false;
          }
        }
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();

    return {
      workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
    };
  }
}
