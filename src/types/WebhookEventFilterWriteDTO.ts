import { WebhookEventFilterWriteChannelDTO } from "./WebhookEventFilterWriteChannelDTO";
import { WebhookEventFilterWriteInboxDTO } from "./WebhookEventFilterWriteInboxDTO";

export type WebhookEventFilterWriteDTO =
  // | WebhookEventFilterWriteCustomAttributeDTO
  // | WebhookEventFilterWriteDefaultAttributeDTO
  // | WebhookEventFilterWriteHandleDTO;
  WebhookEventFilterWriteInboxDTO | WebhookEventFilterWriteChannelDTO;
