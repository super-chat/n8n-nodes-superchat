import {
  type IDataObject,
  type IHookFunctions,
  INodeProperties,
  type INodeType,
  type INodeTypeDescription,
  type IWebhookFunctions,
  type IWebhookResponseData,
  NodeConnectionType,
} from "n8n-workflow";
import { LIST_SEARCH_METHODS, SearchFunction } from "../../definitions";
import { createTypesafeParameterGetter } from "../../magic";
import { ContactWriteDefaultAttributeField } from "../../types/ContactWriteDefaultAttributeField";
import { WebhookEventFilterWriteDTO } from "../../types/WebhookEventFilterWriteDTO";
import { WebhookEventType } from "../../types/WebhookEventType";
import { WebhookEventWriteDTO } from "../../types/WebhookEventWriteDTO";
import { assertUnreachable } from "../../typescript";
import { superchatJsonApiRequest } from "./GenericFunctions";

type ConversationStatus = "open" | "done" | "snoozed";

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
  {
    name: "Conversation Status Changed",
    value: "conversation_status_changed",
  },
] as const;

export type Topic = (typeof TOPIC_OPTIONS)[number]["value"];

const properties = [
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
      "Only listen for inbound messages, outbound messages, failed messages or conversation status changes on specified channels",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Channel",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "A message channel",
            hint: "Only applicable for inbound message, outbound message, failed message or conversation status change events",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter an ID",
              },
              {
                displayName: "List",
                name: "list",
                type: "list",
                typeOptions: {
                  searchListMethod:
                    "messageChannelSearch" satisfies SearchFunction,
                  searchable: false,
                  searchFilterRequired: false,
                },
              },
            ],
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
      "Only listen for inbound messages, outbound messages, failed messages or conversation status changes on specified inboxes",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Inbox",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "An inbox",
            hint: "Only applicable for inbound message, outbound message, failed message or conversation status change events",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter an ID",
              },
              {
                displayName: "List",
                name: "list",
                type: "list",
                typeOptions: {
                  searchListMethod: "inboxSearch" satisfies SearchFunction,
                  searchable: false,
                  searchFilterRequired: false,
                },
              },
            ],
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
            displayName: "Custom Attribute",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "A custom attribute",
            hint: "Only applicable for contact updated events",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter an ID",
              },
              {
                displayName: "List",
                name: "list",
                type: "list",
                typeOptions: {
                  searchListMethod:
                    "customAttributeSearch" satisfies SearchFunction,
                  searchable: false,
                  searchFilterRequired: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },

  {
    displayName: "Filter by Built-in Attribute",
    name: "builtinAttributes",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add Built-in Attribute",
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
            displayName: "Built-in Attribute",
            name: "id",
            type: "options",
            // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
            default: "",
            hint: "Only applicable for contact updated events",
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
          },
        ],
      },
    ],
  },

  {
    displayName: "Filter by Conversation Status",
    name: "conversationStatus",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add Conversation Status",
    description:
      "Only listen for conversation status changes based on the status they changed to",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Conversation Status",
            name: "id",
            type: "options",
            // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
            default: "",
            hint: "Only applicable for conversation status changed events",
            options: [
              {
                name: "Done",
                value: "done" satisfies ConversationStatus,
              },
              {
                name: "Open",
                value: "open" satisfies ConversationStatus,
              },
              {
                name: "Snoozed",
                value: "snoozed" satisfies ConversationStatus,
              },
            ],
          },
        ],
      },
    ],
  },
] as const satisfies INodeProperties[];

export class SuperchatTrigger implements INodeType {
  methods = {
    listSearch: LIST_SEARCH_METHODS,
  };

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
    outputs: ["main" satisfies NodeConnectionType],
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
    properties: properties,
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const getNodeParameter = createTypesafeParameterGetter(properties);

        const webhookUrl = this.getNodeWebhookUrl("default")!!;
        const webhookData = this.getWorkflowStaticData("node");
        const topic = getNodeParameter(this, "topic");

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
        const getNodeParameter = createTypesafeParameterGetter(properties);

        const webhookData = this.getWorkflowStaticData("node");
        const topic = getNodeParameter(this, "topic");
        const webhookUrl = this.getNodeWebhookUrl("default")!!;

        const events = (() => {
          if (topic === "conversation_status_changed") {
            const conversationStatusParamValue = getNodeParameter(
              this,
              "conversationStatus"
            );

            const channelIdsParamValue = getNodeParameter(this, "channelIds");

            const inboxIdsParamValue = getNodeParameter(this, "inboxIds");

            const conversationStatuses = (
              conversationStatusParamValue.values ?? []
            ).map(({ id: value }) => value);

            const channelIds = (channelIdsParamValue.values ?? []).flatMap(
              ({ id: { value } }) => (typeof value === "string" ? [value] : [])
            );

            const inboxIds = (inboxIdsParamValue.values ?? []).flatMap(
              ({ id: { value } }) => (typeof value === "string" ? [value] : [])
            );

            const actualStatuses =
              conversationStatuses.length > 0
                ? conversationStatuses
                : (["open", "done", "snoozed"] as const);

            const filters: WebhookEventFilterWriteDTO[] = [];

            if (channelIds.length > 0) {
              filters.push({
                type: "channel",
                ids: channelIds,
              });
            }

            if (inboxIds.length > 0) {
              filters.push({
                type: "inbox",
                ids: inboxIds,
              });
            }

            return actualStatuses.map(
              (status): WebhookEventWriteDTO => ({
                type: (
                  {
                    open: "conversation_opened",
                    done: "conversation_done",
                    snoozed: "conversation_snoozed",
                  } as const
                )[status],
                filters,
              })
            );
          }

          if (
            topic === "contact_created" ||
            topic === "contact_updated" ||
            topic === "note_created" ||
            topic === "message_inbound" ||
            topic === "message_outbound" ||
            topic === "message_failed"
          ) {
            const event = (() => {
              if (topic === "note_created" || topic === "contact_created") {
                return {
                  type: topic,
                  filters: [],
                };
              }

              if (topic === "contact_updated") {
                const customAttributeIdsParamValue = getNodeParameter(
                  this,
                  "customAttributeIds"
                );

                const builtinAttributesParamValue = getNodeParameter(
                  this,
                  "builtinAttributes"
                );

                const builtinAttributes = (
                  builtinAttributesParamValue.values ?? []
                ).map(({ id: value }) => value);

                const customAttributeIds = (
                  customAttributeIdsParamValue.values ?? []
                ).flatMap(({ id: { value } }) =>
                  typeof value === "string" ? [value] : []
                );

                const filters: WebhookEventFilterWriteDTO[] = [];

                if (customAttributeIds.length > 0) {
                  filters.push({
                    type: "custom_attribute",
                    ids: customAttributeIds,
                  });
                }

                if (builtinAttributes.length > 0) {
                  filters.push({
                    type: "default_attribute",
                    attributes: builtinAttributes,
                  });
                }

                return {
                  type: topic,
                  filters,
                };
              }

              if (
                topic === "message_failed" ||
                topic === "message_inbound" ||
                topic === "message_outbound"
              ) {
                const channelIdsParamValue = getNodeParameter(
                  this,
                  "channelIds"
                );

                const inboxIdsParamValue = getNodeParameter(this, "inboxIds");

                const channelIds = (channelIdsParamValue.values ?? []).flatMap(
                  ({ id: { value } }) =>
                    typeof value === "string" ? [value] : []
                );

                const inboxIds = (inboxIdsParamValue.values ?? []).flatMap(
                  ({ id: { value } }) =>
                    typeof value === "string" ? [value] : []
                );

                const filters: WebhookEventFilterWriteDTO[] = [];

                if (channelIds.length > 0) {
                  filters.push({
                    type: "channel",
                    ids: channelIds,
                  });
                }

                if (inboxIds.length > 0) {
                  filters.push({
                    type: "inbox",
                    ids: inboxIds,
                  });
                }

                return {
                  type: topic,
                  filters,
                };
              }

              return assertUnreachable(topic);
            })();

            return [event];
          }

          return assertUnreachable(topic);
        })();

        const body = {
          target_url: webhookUrl,
          events,
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
