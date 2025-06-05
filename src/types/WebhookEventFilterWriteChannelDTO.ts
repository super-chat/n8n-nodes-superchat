import { MessageChannelConfigPublicId } from "./MessageChannelConfigPublicId";

export type WebhookEventFilterWriteChannelDTO = {
  type: "channel";
  ids: MessageChannelConfigPublicId[];
};
