import { ContactAttributePublicId } from "./ContactAttributePublicId";
import { ContactAttributeType } from "./ContactAttributeType";
import { PAContactAttributeSelectOptionDTO } from "./PAContactAttributeSelectOptionDTO";

export type PAListContactAttributeDTO = {
  id: ContactAttributePublicId;
  name: string;
  type: ContactAttributeType;
  resource: "contact";
  option_values: PAContactAttributeSelectOptionDTO[];
};
