import { ContactAttributePublicId } from "./ContactAttributePublicId";

export type PAWriteContactAttributeValueDTO = {
  id: ContactAttributePublicId;
  value: string | number | string[];
};
