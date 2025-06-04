import { MessagePublicId } from "./MessagePublicId";
import { PAMessageContentReqDTO } from "./PAMessageContentReqDTO";
import { PAMessageReqReceiverDTO } from "./PAMessageReqReceiverDTO";
import { PAMessageReqSenderDTO } from "./PAMessageReqSenderDTO";

export type PASendMessageDTO = {
  to: PAMessageReqReceiverDTO[];
  from: PAMessageReqSenderDTO;
  content: PAMessageContentReqDTO;
  in_reply_to?: MessagePublicId;
};
