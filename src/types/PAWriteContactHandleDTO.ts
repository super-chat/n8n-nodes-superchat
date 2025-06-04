import { ContactHandlePublicId } from "./ContactHandlePublicId";
import { ContactHandleType } from "./ContactHandleType";

export type PAWriteContactHandleDTO = {
  id?: ContactHandlePublicId | null;
  type: ContactHandleType;
  value: string;
};
