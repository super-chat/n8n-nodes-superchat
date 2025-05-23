import {
  type IHookFunctions,
  type IWebhookFunctions,
  type IDataObject,
  type INodeType,
  type INodeTypeDescription,
  type IWebhookResponseData,
  NodeConnectionType,
  IRequestOptions,
} from "n8n-workflow";
import { BASE_URL } from "../../shared";

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
      {
        displayName: "Trigger On",
        name: "topic",
        type: "options",
        default: "contact_created",
        options: [
          {
            name: "Contact Created",
            value: "contact_created",
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
        const topic = this.getNodeParameter("topic") as string;

        const webhookId = webhookData.webhookId;

        if (!webhookId) {
          return false;
        }

        const options: IRequestOptions = {
          headers: {
            Accept: "application/json",
          },
          method: "GET",
          body: {},
          uri: `${BASE_URL}/webhooks/${webhookId}`,
          json: true,
        };

        const data = await this.helpers.requestWithAuthentication.call(
          this,
          "superchatApi",
          options
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
        const topic = this.getNodeParameter("topic") as string;
        const webhookUrl = this.getNodeWebhookUrl("default")!!;

        const options: IRequestOptions = {
          headers: {
            Accept: "application/json",
          },
          method: "POST",
          body: {
            target_url: webhookUrl,
            events: [
              {
                type: topic,
              },
            ],
          },
          uri: `${BASE_URL}/webhooks`,
          json: true,
        };

        const data = await this.helpers.requestWithAuthentication.call(
          this,
          "superchatApi",
          options
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
            const options: IRequestOptions = {
              headers: {
                Accept: "application/json",
              },
              method: "DELETE",
              uri: `${BASE_URL}/webhooks/${webhookData.webhookId}`,
              json: true,
            };

            const data = await this.helpers.requestWithAuthentication.call(
              this,
              "superchatApi",
              options
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
