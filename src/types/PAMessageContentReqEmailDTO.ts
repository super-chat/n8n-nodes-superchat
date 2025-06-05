import { PASendMessageReqEmailContentFileDTO } from "./PASendMessageReqEmailContentFileDTO";

export type PAMessageContentReqEmailDTO = {
  type: "email";
  subject?: string;
  text?: string;
  html?: string;
  files?: PASendMessageReqEmailContentFileDTO[];
};
