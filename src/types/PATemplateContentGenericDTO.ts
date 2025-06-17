import { PATemplateVariableDTO } from "./PATemplateVariableDTO";

export type PATemplateContentGenericDTO = {
  type: "generic_template";
  body: string;
  variables: PATemplateVariableDTO[];
};
