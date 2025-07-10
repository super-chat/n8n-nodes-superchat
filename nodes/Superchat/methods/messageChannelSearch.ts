import {
  ILoadOptionsFunctions,
  INodeListSearchItems,
  INodeListSearchResult,
} from "n8n-workflow";
import { ConversationType } from "../../../types/ConversationType";
import { PageableResponse } from "../../../types/PageableResponse";
import { PAMessageChannelConfigDTO } from "../../../types/PAMessageChannelConfigDTO";
import { superchatJsonApiRequest } from "../GenericFunctions";
import { OperationKeyByResource, ResourceKey } from "../Superchat.node";

function formatConversationType(input: ConversationType) {
  return {
    whats_app: "WhatsApp",
    google_business_messaging: "Google Business Messaging",
    facebook_messenger: "Facebook Messenger",
    telegram: "Telegram",
    live_chat: "Live Chat",
    instagram: "Instagram",
    sms: "SMS",
    mail: "Mail",
  }[input];
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
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    results,
    paginationToken: res.pagination.next_cursor,
  };
}
