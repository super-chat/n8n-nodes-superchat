import { ContactWriteDefaultAttributeField } from "./ContactWriteDefaultAttributeField";

export type WebhookEventFilterWriteDefaultAttributeDTO = {
  type: "default_attribute";
  attributes: ContactWriteDefaultAttributeField[];
};
