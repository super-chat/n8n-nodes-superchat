import { Gender } from "./Gender";
import { PAWriteContactAttributeValueDTO } from "./PAWriteContactAttributeValueDTO";
import { PAWriteContactHandleDTO } from "./PAWriteContactHandleDTO";

export type PACreateContactDTO = {
  first_name: string | null;
  last_name: string | null;
  gender: Gender | null;
  handles: PAWriteContactHandleDTO[];
  custom_attributes: PAWriteContactAttributeValueDTO[];
};
