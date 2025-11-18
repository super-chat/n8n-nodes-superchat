import { FilePublicId } from "./FilePublicId";

export type PACreateNoteDTO = {
  content: string;
  file_ids?: FilePublicId[];
};
