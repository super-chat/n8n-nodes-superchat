import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PATemplateNodeDTO } from "../../../types/PATemplateNodeDTO";
import { PageableResponse } from "../../../types/PageableResponse";
import { superchatJsonApiRequest } from "../GenericFunctions";

export async function templateSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/templates",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PATemplateNodeDTO>;

  const results = res.results.map(
    (template) =>
      ({
        name: template.name,
        value: template.id,
      }) satisfies INodeListSearchItems
  );

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
