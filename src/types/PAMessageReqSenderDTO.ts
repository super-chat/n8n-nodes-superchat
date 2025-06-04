import { MessageChannelConfigPublicId } from "./MessageChannelConfigPublicId";

export type PAMessageReqSenderDTO = {
  channel_id: MessageChannelConfigPublicId;
  name?: string;
};
