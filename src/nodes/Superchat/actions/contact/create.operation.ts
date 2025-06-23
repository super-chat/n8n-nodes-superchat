import {
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";
import { createTypesafeParameterGetter } from "../../../../magic";
import { ContactHandleType } from "../../../../types/ContactHandleType";
import { Gender } from "../../../../types/Gender";
import { PACreateContactDTO } from "../../../../types/PACreateContactDTO";
import { PAWriteContactHandleDTO } from "../../../../types/PAWriteContactHandleDTO";
import { superchatJsonApiRequest } from "../../GenericFunctions";
import { getCustomAttributesNodeParameter } from "../../methods/resourceMapping/getCustomContactAttributeFields";
import { ResourceKey, ResourceMappingFunction } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";

const properties = [
  {
    displayName: "First Name",
    name: "firstName",
    type: "string",
    default: "",
    description: "The first name of the contact",
  },
  {
    displayName: "Last Name",
    name: "lastName",
    type: "string",
    default: "",
    description: "The last name of the contact",
  },
  // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
  {
    displayName: "Gender",
    name: "gender",
    type: "options",
    options: [
      { name: "Female", value: "female" satisfies Gender },
      { name: "Male", value: "male" satisfies Gender },
      { name: "Diverse", value: "diverse" satisfies Gender },
    ],
    default: "female" satisfies Gender,
    description: "The gender of the contact",
  },
  {
    displayName: "Email Addresses",
    name: "emails",
    type: "fixedCollection",
    default: { values: [] },
    description: "The email addresses of the contact",
    placeholder: "Add Email",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Value",
            name: "value",
            type: "string",
            default: "",
            description: "An email address",
          },
        ],
      },
    ],
  },
  {
    displayName: "Phone Numbers",
    name: "phoneNumbers",
    type: "fixedCollection",
    default: { values: [] },
    description: "The phone numbers of the contact",
    placeholder: "Add Phone Number",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Value",
            name: "value",
            type: "string",
            default: "",
            description: "A phone number",
          },
        ],
      },
    ],
  },
  {
    displayName: "Custom Attributes",
    name: "customAttributes",
    type: "resourceMapper",
    noDataExpression: true,
    default: {
      mappingMode: "defineBelow",
      value: null,
    },
    typeOptions: {
      resourceMapper: {
        resourceMapperMethod:
          "getCustomContactAttributeFields" satisfies ResourceMappingFunction,
        mode: "map",
        fieldWords: {
          singular: "Custom Attribute",
          plural: "Custom Attributes",
        },
        addAllFields: false,
        multiKeyMatch: true,
        supportAutoMap: false,
      },
    },
  },
] as const satisfies INodeProperties[];

export const description = updateDisplayOptions(
  {
    show: {
      resource: ["contact" satisfies ResourceKey],
      operation: ["create" satisfies ContactOperationKey],
    },
  },
  properties
);

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData> {
  const getNodeParameter = createTypesafeParameterGetter(properties);

  const firstName = getNodeParameter(this, "firstName", i);
  const lastName = getNodeParameter(this, "lastName", i);
  const gender = getNodeParameter(this, "gender", i);
  const emails = getNodeParameter(this, "emails", i);
  const phoneNumbers = getNodeParameter(this, "phoneNumbers", i);

  const customAttributes = await getCustomAttributesNodeParameter.call(
    this,
    "customAttributes",
    i
  );

  const handles = [
    ...(emails.values ?? []).map(
      ({ value }) =>
        ({
          type: "mail" satisfies ContactHandleType,
          value,
        }) satisfies PAWriteContactHandleDTO
    ),
    ...(phoneNumbers.values ?? []).map(
      ({ value }) =>
        ({
          type: "phone" satisfies ContactHandleType,
          value,
        }) satisfies PAWriteContactHandleDTO
    ),
  ] satisfies PAWriteContactHandleDTO[];

  const body = {
    first_name: firstName,
    last_name: lastName,
    gender,
    handles,
    custom_attributes: customAttributes,
  } satisfies PACreateContactDTO;

  const responseData = await superchatJsonApiRequest.call(
    this,
    "POST",
    "/contacts",
    body
  );

  return responseData;
}
