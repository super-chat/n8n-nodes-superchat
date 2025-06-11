import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  ResourceMapperField,
  ResourceMapperFields,
  ResourceMapperValue,
} from "n8n-workflow";
import { PageableResponse } from "../../../../types/PageableResponse";
import { PAListContactAttributeDTO } from "../../../../types/PAListContactAttributeDTO";
import { PAWriteContactAttributeValueDTO } from "../../../../types/PAWriteContactAttributeValueDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { ResourceKey } from "../../Superchat.node";

export async function getCustomContactAttributeFields(
  this: ILoadOptionsFunctions
): Promise<ResourceMapperFields> {
  const resource = this.getCurrentNodeParameter("resource") as ResourceKey;
  if (resource !== "contact") return { fields: [] };

  const customAttributeRes = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/custom-attributes",
    undefined,
    {
      size: 1000,
    }
  )) as PageableResponse<PAListContactAttributeDTO>;

  const customAttributes = customAttributeRes.results;

  const fields = customAttributes.flatMap(
    (attribute): ResourceMapperField[] => {
      const attributeType = attribute.type;

      if (attributeType === "single_select") {
        const options = attribute.option_values.map(
          (option): INodePropertyOptions => ({
            name: option.value,
            value: option.value,
          })
        );

        return [
          {
            id: attribute.id,
            displayName: attribute.name,
            type: "options",
            defaultMatch: true,
            canBeUsedToMatch: false,
            required: false,
            display: true,
            options,
          },
        ];
      }

      const type = (
        {
          dateonly: "dateTime",
          datetime: "dateTime",
          text: "string",
          number: "number",
          multi_select: "array",
        } as const
      )[attributeType];

      return [
        {
          id: attribute.id,
          displayName: attribute.name,
          type: type,
          defaultMatch: true,
          canBeUsedToMatch: false,
          required: false,
          display: true,
        },
      ];
    }
  );

  // HACK: If there are no parameters, add a empty field to avoid the resource mapper from crashing
  if (fields.length === 0) {
    fields.push({
      id: "NO_PARAMETERS",
      displayName: "No Parameters",
      defaultMatch: false,
      canBeUsedToMatch: false,
      required: false,
      display: true,
      type: "string",
    });
  }

  return {
    fields,
  };
}

export async function getCustomAttributesNodeParameter(
  this: IExecuteFunctions,
  parameterName: string,
  itemIndex: number
) {
  const customAttributeRes = (await superchatJsonApiRequest.call(
    this,
    "GET",
    "/custom-attributes",
    undefined,
    {
      size: 1000,
    }
  )) as PageableResponse<PAListContactAttributeDTO>;

  const customAttributes = customAttributeRes.results;

  const customAttributesResourceMapperValue = this.getNodeParameter(
    "customAttributes",
    itemIndex
  ) as ResourceMapperValue;

  const customAttributesResourceMapperValueObject =
    customAttributesResourceMapperValue.value ?? {};

  return Object.entries(customAttributesResourceMapperValueObject).flatMap(
    ([customAttributeId, value]): PAWriteContactAttributeValueDTO[] => {
      const attribute = customAttributes.find(
        (attr) => attr.id === customAttributeId
      );

      if (!attribute) {
        return [];
      }

      if (attribute.type === "multi_select") {
        if (value === null || typeof value !== "string") {
          return [];
        }

        if (value === null) {
          return [
            {
              id: customAttributeId,
              value: [],
            },
          ];
        }

        return [
          {
            id: customAttributeId,
            value: JSON.parse(value) as string[],
          } satisfies PAWriteContactAttributeValueDTO,
        ];
      }

      if (attribute.type === "datetime" || attribute.type === "dateonly") {
        if (value === null || typeof value !== "string") {
          return [];
        }

        if (value === null) {
          return [
            {
              id: customAttributeId,
              value: null,
            },
          ];
        }

        const date = new Date(value);

        return [
          {
            id: customAttributeId,
            value:
              attribute.type === "datetime"
                ? date.toISOString()
                : date.toISOString().split("T")[0],
          },
        ];
      }

      if (typeof value === "boolean") {
        return [];
      }

      return [
        {
          id: customAttributeId,
          value: value,
        } satisfies PAWriteContactAttributeValueDTO,
      ];
    }
  );
}
