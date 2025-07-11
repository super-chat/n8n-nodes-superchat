import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
  INodeParameterResourceLocator,
} from "n8n-workflow";
import { PATemplateNodeDTO } from "../../../types/PATemplateNodeDTO";
import { PageableResponse } from "../../../types/PageableResponse";
import { superchatJsonApiRequest } from "../GenericFunctions";
import { OperationKeyByResource, ResourceKey } from "../Superchat.node";

export async function templateSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const currentNodeParams = this.getCurrentNodeParameters();

  const resource = currentNodeParams?.resource as ResourceKey | undefined;

  let channelId: string | undefined = undefined;

  if ((resource as ResourceKey) === "message") {
    const operation =
      currentNodeParams?.operation as OperationKeyByResource<"message">;

    if (operation === "sendWhatsAppTemplate") {
      const channelIdParamValue = currentNodeParams?.channelId as
        | INodeParameterResourceLocator
        | undefined;

      if (
        !(
          channelIdParamValue &&
          channelIdParamValue.value &&
          typeof channelIdParamValue.value === "string"
        )
      ) {
        return {
          results: [],
        };
      }

      channelId = channelIdParamValue.value;
    }
  }

  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/templates",
    undefined,
    {
      after: paginationToken,
      cahnnel_id: channelId,
    }
  )) as PageableResponse<PATemplateNodeDTO>;

  const results = res.results
    .filter((template) => {
      if ((resource as ResourceKey) === "message") {
        const operation =
          currentNodeParams?.operation as OperationKeyByResource<"message">;

        if (operation === "sendWhatsAppTemplate") {
          return (
            template.content.type === "whats_app_template" &&
            template.status === "approved"
          );
        }
      }

      return true;
    })
    .map(
      (template) =>
        ({
          name: template.name,
          value: template.id,
        }) satisfies INodeListSearchItems
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
