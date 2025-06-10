import { FilePublicId } from "./FilePublicId";
import { PAFileLinkDTO } from "./PAFileLinkDTO";

export type PAFileDTO = {
  id: FilePublicId;
  name: string;
  mime_type: string;
  link: PAFileLinkDTO;
  url: string;
};
