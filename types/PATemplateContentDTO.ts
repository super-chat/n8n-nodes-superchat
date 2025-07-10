import { PATemplateContentGenericDTO } from "./PATemplateContentGenericDTO";
import { PATemplateContentWhatsAppDTO } from "./PATemplateContentWhatsAppDTO";

export type PATemplateContentDTO =
  | PATemplateContentGenericDTO
  | PATemplateContentWhatsAppDTO;
