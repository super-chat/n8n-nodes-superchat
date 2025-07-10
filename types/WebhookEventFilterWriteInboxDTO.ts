import { InboxPublicId } from "./InboxPublicId";

export type WebhookEventFilterWriteInboxDTO = {
  type: "inbox";
  ids: InboxPublicId[];
};
