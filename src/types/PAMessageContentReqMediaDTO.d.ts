import { FilePublicId } from "./FilePublicId";

export type PAMessageContentReqMediaDTO = {
  type: "media";
  file_id: FilePublicId;
};
