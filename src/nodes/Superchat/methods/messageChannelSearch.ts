import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { match } from "ts-pattern";
import { ConversationType } from "../../../types/ConversationType";
import { PageableResponse } from "../../../types/PageableResponse";
import { PAMessageChannelConfigDTO } from "../../../types/PAMessageChannelConfigDTO";
import { superchatJsonApiRequest } from "../GenericFunctions";
import { OperationKeyByResource, ResourceKey } from "../Superchat.node";

function formatConversationType(input: ConversationType) {
  return match(input)
    .with("whats_app", () => "WhatsApp")
    .with("google_business_messaging", () => "Google Business Messaging")
    .with("facebook_messenger", () => "Facebook Messenger")
    .with("telegram", () => "Telegram")
    .with("live_chat", () => "Live Chat")
    .with("instagram", () => "Instagram")
    .with("sms", () => "SMS")
    .with("mail", () => "Mail")
    .exhaustive();
}

export async function messageChannelSearch(
  this: ILoadOptionsFunctions,
  filter?: string | undefined,
  paginationToken?: string
): Promise<INodeListSearchResult> {
  const currentNodeParams = this.getCurrentNodeParameters();

  const resource = currentNodeParams?.resource as ResourceKey | undefined;

  const res = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/channels",
    undefined,
    {
      after: paginationToken,
    }
  )) as PageableResponse<PAMessageChannelConfigDTO>;

  const results = res.results
    .filter((channel) => {
      if (resource === "message") {
        const operation =
          currentNodeParams?.operation as OperationKeyByResource<
            typeof resource
          >;

        if (operation === "sendWhatsAppTemplate") {
          return channel.type === "whats_app";
        }

        if (operation === "sendMail") {
          return channel.type === "mail";
        }
      }

      return true;
    })
    .map(
      (channel) =>
        ({
          name: `${formatConversationType(channel.type)}: ${channel.name}`,
          value: channel.id,
        }) satisfies INodeListSearchItems
    );

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
