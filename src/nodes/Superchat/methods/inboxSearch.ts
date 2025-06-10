import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PageableResponse } from "../../../types/PageableResponse";
import { PAInboxDTO } from "../../../types/PAInboxDTO";
import { superchatJsonApiRequest } from "../GenericFunctions";

export async function inboxSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/inboxes",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PAInboxDTO>;

  const results = res.results.map(
    (inbox) =>
      ({
        name: inbox.name,
        value: inbox.id,
      }) satisfies INodeListSearchItems
  );

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
