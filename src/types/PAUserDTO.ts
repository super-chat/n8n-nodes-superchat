import { UserPublicId } from "./UserPublicId";

export type PAUserDTO = {
  id: UserPublicId;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  url: string;
};
