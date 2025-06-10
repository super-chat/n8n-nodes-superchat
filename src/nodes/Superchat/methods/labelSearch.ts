import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PAConversationLabelDTO } from "../../../types/PAConversationLabelDTO";
import { PageableResponse } from "../../../types/PageableResponse";
import { superchatJsonApiRequest } from "../GenericFunctions";

export async function labelSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/labels",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PAConversationLabelDTO>;

  const results = res.results.map(
    (label) =>
      ({
        name: label.name,
        value: label.id,
      }) satisfies INodeListSearchItems
  );

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
