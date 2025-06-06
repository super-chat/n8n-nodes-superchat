import { Instant } from "./Instant";
import { PATemplateNodeChannelDTO } from "./PATemplateNodeChannelDTO";
import { TemplateNodePublicId } from "./TemplateNodePublicId";
import { WATemplateStatus } from "./WATemplateStatus";

export type PATemplateNodeDTO = {
  id: TemplateNodePublicId;
  status: WATemplateStatus;
  name: string;
  // content: PATemplateContentDTO;
  channels: PATemplateNodeChannelDTO[];
  created_at: Instant;
  updated_at: Instant;
  url: string;
};
