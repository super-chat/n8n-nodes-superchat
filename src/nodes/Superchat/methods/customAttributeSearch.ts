import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PageableResponse } from "../../../types/PageableResponse";
import { PAListContactAttributeDTO } from "../../../types/PAListContactAttributeDTO";
import { superchatJsonApiRequest } from "../GenericFunctions";

export async function customAttributeSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/custom-attributes",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PAListContactAttributeDTO>;

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
