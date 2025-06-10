import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PAUserDTO } from "../../../types/PAUserDTO";
import { PageableResponse } from "../../../types/PageableResponse";
import { superchatJsonApiRequest } from "../GenericFunctions";

export async function userSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/users",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PAUserDTO>;

  const results = res.results.map(
    (user) =>
      ({
        name:
          [user.first_name, user.last_name].filter(Boolean).join(" ") +
          ` (${user.email})`,
        value: user.id,
      }) satisfies INodeListSearchItems
  );

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
