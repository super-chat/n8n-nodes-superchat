import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { PageableResponse } from "../../../types/PageableResponse";
import { PAMessageChannelConfigDTO } from "../../../types/PAMessageChannelConfigDTO";
import { superchatJsonApiRequest } from "../GenericFunctions";

export async function messageChannelSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/channels",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PAMessageChannelConfigDTO>;

  const results = res.results.map(
    (channel) =>
      ({
        name: channel.name,
        value: channel.id,
      }) satisfies INodeListSearchItems
  );

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
