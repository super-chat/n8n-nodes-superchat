export type WebhookEventType =
  | "message_inbound"
  | "message_outbound"
  | "message_failed"
  | "note_created"
  | "contact_created"
  | "contact_updated"
  | "conversation_opened"
  | "conversation_done"
  | "conversation_snoozed"
  | "conversation_deleted";
