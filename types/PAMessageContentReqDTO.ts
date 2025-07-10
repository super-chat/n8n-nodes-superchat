import { PAMessageContentReqEmailDTO } from "./PAMessageContentReqEmailDTO";
import { PAMessageContentReqMediaDTO } from "./PAMessageContentReqMediaDTO";
import { PAMessageContentReqTextDTO } from "./PAMessageContentReqTextDTO";
import { PAMessageContentReqWhatsAppTemplateDTO } from "./PAMessageContentReqWhatsAppTemplateDTO";

export type PAMessageContentReqDTO =
  // | PAMessageContentReqWhatsAppQuickReplyDTO
  // | PAMessageContentReqWhatsAppListDTO
  // | PAMessageContentReqGenericTemplateDTO
  | PAMessageContentReqWhatsAppTemplateDTO
  | PAMessageContentReqEmailDTO
  | PAMessageContentReqTextDTO
  | PAMessageContentReqMediaDTO;
