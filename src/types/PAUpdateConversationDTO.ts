import { ConversationLabelPublicId } from "./ConversationLabelPublicId";
import { ConversationStatus } from "./ConversationStatus";
import { InboxPublicId } from "./InboxPublicId";
import { Instant } from "./Instant";
import { UserPublicId } from "./UserPublicId";

export type PAUpdateConversationDTO = {
  status?: ConversationStatus;
  snoozed_until?: Instant;
  assigned_users?: UserPublicId[];
  labels?: ConversationLabelPublicId[];
  inbox_id?: InboxPublicId;
};
