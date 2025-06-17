import { ContactAttributePublicId } from "./ContactAttributePublicId";

export type PATemplateVariableContactAttributeDTO = {
  type: "contact_attribute";
  position: number;
  display_name: string;
  attribute_id: ContactAttributePublicId;
};
