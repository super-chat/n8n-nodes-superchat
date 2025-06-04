import {
  type INodeExecutionData,
  type INodeProperties,
  type IExecuteFunctions,
  updateDisplayOptions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";
import { ContactHandleType } from "../../../../types/ContactHandleType";
import { PACreateContactDTO } from "../../../../types/PACreateContactDTO";
import { PAWriteContactHandleDTO } from "../../../../types/PAWriteContactHandleDTO";
import { superchatApiRequest } from "../../GenericFunctions";

const properties: INodeProperties[] = [
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
  {
    displayName: "Gender",
    name: "gender",
    type: "options",
    options: [
      { name: "Female", value: "female" },
      { name: "Male", value: "male" },
      { name: "Diverse", value: "diverse" },
    ],
    default: "female",
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
];

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
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const firstName = this.getNodeParameter("firstName", i) as string;
  const lastName = this.getNodeParameter("lastName", i) as string;
  const gender = this.getNodeParameter("gender", i) as string;
  const emails = this.getNodeParameter("emails", i) as {
    values: { value: string }[];
  };
  const phoneNumbers = this.getNodeParameter("phoneNumbers", i) as {
    values: { value: string }[];
  };

  const handles = [
    ...emails.values.map(
      ({ value }) =>
        ({
          type: "mail" satisfies ContactHandleType,
          value,
        }) satisfies PAWriteContactHandleDTO
    ),
    ...phoneNumbers.values.map(
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
    custom_attributes: [],
  } satisfies PACreateContactDTO;

  const responseData = await superchatApiRequest.call(
    this,
    "POST",
    "/contacts",
    body
  );
  returnData.push(responseData);

  return returnData;
}
