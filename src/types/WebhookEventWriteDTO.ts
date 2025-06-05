import { WebhookEventFilterWriteDTO } from "./WebhookEventFilterWriteDTO";
import { WebhookEventType } from "./WebhookEventType";

export type WebhookEventWriteDTO = {
  type: WebhookEventType;
  filters: WebhookEventFilterWriteDTO[];
};
