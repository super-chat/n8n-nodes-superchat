import { customAttributeSearch } from "./nodes/Superchat/methods/customAttributeSearch";
import { fileSearch } from "./nodes/Superchat/methods/fileSearch";
import { inboxSearch } from "./nodes/Superchat/methods/inboxSearch";
import { labelSearch } from "./nodes/Superchat/methods/labelSearch";
import { messageChannelSearch } from "./nodes/Superchat/methods/messageChannelSearch";
import { templateSearch } from "./nodes/Superchat/methods/templateSearch";
import { userSearch } from "./nodes/Superchat/methods/userSearch";

export const LIST_SEARCH_METHODS = {
  templateSearch,
  messageChannelSearch,
  inboxSearch,
  userSearch,
  labelSearch,
  fileSearch,
  customAttributeSearch,
} as const;

export type SearchFunction = keyof typeof LIST_SEARCH_METHODS;
