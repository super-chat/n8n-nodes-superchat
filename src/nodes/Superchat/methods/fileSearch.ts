import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PAFileDTO } from "../../../types/PAFileDTO";
import { PageableResponse } from "../../../types/PageableResponse";
import { superchatJsonApiRequest } from "../GenericFunctions";

export async function fileSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/files",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PAFileDTO>;

  const results = res.results
    .map(
      (label) =>
        ({
          name: label.name,
          value: label.id,
        }) satisfies INodeListSearchItems
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
