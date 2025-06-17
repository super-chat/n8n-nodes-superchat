import { PATemplateVariableDTO } from "./PATemplateVariableDTO";
import { WATemplateCategory } from "./WATemplateCategory";

export type PATemplateContentWhatsAppDTO = {
  type: "whats_app_template";
  category: WATemplateCategory;
  body: string;
  footer: string | null;
  // buttons: PATemplateContentWhatsAppButton[] | null;
  // header: PATemplateContentWhatsAppHeader | null;
  variables: PATemplateVariableDTO[];
};
