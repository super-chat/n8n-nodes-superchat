import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PageableResponse } from "../../../types/PageableResponse";
import { PAListContactAttributeDTO } from "../../../types/PAListContactAttributeDTO";
import { superchatJsonApiRequest } from "../GenericFunctions";

type CustomAttributeRequestContext =
  | IExecuteFunctions
  | ILoadOptionsFunctions;

/**
 * Fetch all custom attributes. The API uses cursor pagination, so `size` is
 * only a page-size hint and must not be used as an indication that the
 * response contains every attribute.
 */
export async function getAllCustomAttributes(
  this: CustomAttributeRequestContext
): Promise<PAListContactAttributeDTO[]> {
  const attributes: PAListContactAttributeDTO[] = [];
  let nextCursor: string | undefined;
  const seenCursors = new Set<string>();

  do {
    if (nextCursor !== undefined) {
      if (seenCursors.has(nextCursor)) break;
      seenCursors.add(nextCursor);
    }

    const response = (await superchatJsonApiRequest.call(
      this,
      "GET",
      "/custom-attributes",
      undefined,
      {
        size: 1000,
        ...(nextCursor === undefined ? {} : { after: nextCursor }),
      }
    )) as PageableResponse<PAListContactAttributeDTO>;

    const cursor = response.pagination.next_cursor;
    if (cursor !== null && cursor === nextCursor) break;

    attributes.push(...response.results);
    nextCursor = cursor ?? undefined;
  } while (nextCursor !== undefined);

  return attributes;
}

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
