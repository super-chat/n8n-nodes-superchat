import { PAMessageReqTemplateVariableDTO } from "./PAMessageReqTemplateVariableDTO";
import { PASendMessageReqWhatsAppTemplateContentFileDTO } from "./PASendMessageReqWhatsAppTemplateContentFileDTO";
import { TemplateNodePublicId } from "./TemplateNodePublicId";

export type PAMessageContentReqWhatsAppTemplateDTO = {
  type: "whats_app_template";
  template_id: TemplateNodePublicId;
  file?: PASendMessageReqWhatsAppTemplateContentFileDTO;
  variables?: PAMessageReqTemplateVariableDTO[];
};
