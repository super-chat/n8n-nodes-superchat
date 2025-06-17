import { PATemplateVariableContactAttributeDTO } from "./PATemplateVariableContactAttributeDTO";
import { PATemplateVariableStaticDTO } from "./PATemplateVariableStaticDTO";

export type PATemplateVariableDTO =
  | PATemplateVariableStaticDTO
  | PATemplateVariableContactAttributeDTO;
