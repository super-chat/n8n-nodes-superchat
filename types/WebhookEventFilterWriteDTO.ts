import { WebhookEventFilterWriteChannelDTO } from "./WebhookEventFilterWriteChannelDTO";
import { WebhookEventFilterWriteCustomAttributeDTO } from "./WebhookEventFilterWriteCustomAttributeDTO";
import { WebhookEventFilterWriteDefaultAttributeDTO } from "./WebhookEventFilterWriteDefaultAttributeDTO";
import { WebhookEventFilterWriteInboxDTO } from "./WebhookEventFilterWriteInboxDTO";

export type WebhookEventFilterWriteDTO =
  // | WebhookEventFilterWriteHandleDTO;
  | WebhookEventFilterWriteCustomAttributeDTO
  | WebhookEventFilterWriteDefaultAttributeDTO
  | WebhookEventFilterWriteInboxDTO
  | WebhookEventFilterWriteChannelDTO;
