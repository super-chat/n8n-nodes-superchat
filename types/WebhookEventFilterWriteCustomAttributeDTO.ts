import { ContactAttributePublicId } from "./ContactAttributePublicId";

export type WebhookEventFilterWriteCustomAttributeDTO = {
  type: "custom_attribute";
  ids: ContactAttributePublicId[];
};
