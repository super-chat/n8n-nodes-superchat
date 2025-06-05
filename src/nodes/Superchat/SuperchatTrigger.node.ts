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
        options: [
          {
            name: "Contact Created",
            value: "contact_created" satisfies WebhookEventType,
          },
          {
            name: "Contact Updated",
            value: "contact_updated" satisfies WebhookEventType,
          },
        ],
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
        const topic = this.getNodeParameter("topic") as WebhookEventType;
        const webhookUrl = this.getNodeWebhookUrl("default")!!;

        const data = await superchatJsonApiRequest.call(
          this,
          "POST",
          `/webhooks`,
          {
            target_url: webhookUrl,
            events: [
              {
                type: topic,
              },
            ],
          }
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
