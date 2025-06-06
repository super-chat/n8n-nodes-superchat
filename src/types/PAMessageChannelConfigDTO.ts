import { ConversationType } from "./ConversationType";
import { MessageChannelConfigPublicId } from "./MessageChannelConfigPublicId";
import { PAInboxDTO } from "./PAInboxDTO";

export type PAMessageChannelConfigDTO = {
  id: MessageChannelConfigPublicId;
  type: ConversationType;
  name: string;
  inbox: PAInboxDTO;
  url: string;
};
