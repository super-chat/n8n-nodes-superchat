import type {
  INodeExecutionData,
  INodeProperties,
  IExecuteFunctions,
} from "n8n-workflow";
import { ResourceKey } from "../../Superchat.node";
import { ContactOperationKey } from "./Contact.resource";
import { ContactHandleType } from "../../../../types/ContactHandleType";
import { PAUpdateContactDTO } from "../../../../types/PAUpdateContactDTO";
import { PAWriteContactHandleDTO } from "../../../../types/PAWriteContactHandleDTO";
import { superchatApiRequest } from "../../GenericFunctions";

export const description: INodeProperties[] = [
  {
    displayName: "ID",
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["update" satisfies ContactOperationKey],
      },
    },
    name: "id",
    type: "string",
    required: true,
    default: "",
    description: "The ID of the contact to update",
  },
  {
    displayName: "First Name",
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["update" satisfies ContactOperationKey],
      },
    },
    name: "firstName",
    type: "string",
    default: "",
    description: "The first name of the contact",
  },
  {
    displayName: "Last Name",
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["update" satisfies ContactOperationKey],
      },
    },
    name: "lastName",
    type: "string",
    default: "",
    description: "The last name of the contact",
  },
  {
    displayName: "Gender",
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["update" satisfies ContactOperationKey],
      },
    },
    name: "gender",
    type: "options",
    options: [
      { name: "Do Not Update", value: "noop" },
      { name: "Female", value: "female" },
      { name: "Male", value: "male" },
      { name: "Diverse", value: "diverse" },
    ],
    default: "noop",
    description: "The gender of the contact",
  },
  {
    displayName: "Email Addresses",
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["update" satisfies ContactOperationKey],
      },
    },
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
    displayOptions: {
      show: {
        resource: ["contact" satisfies ResourceKey],
        operation: ["update" satisfies ContactOperationKey],
      },
    },
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

export async function execute(
  this: IExecuteFunctions,
  i: number
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  const id = this.getNodeParameter("id", i) as string;
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
    first_name: firstName !== "" ? firstName : null,
    last_name: lastName !== "" ? lastName : null,
    gender: gender !== "noop" ? gender : null,
    handles,
    custom_attributes: [],
  } satisfies PAUpdateContactDTO;

  const responseData = await superchatApiRequest.call(
    this,
    "PATCH",
    `/contacts/${id}`,
    body
  );
  returnData.push(responseData);

  return returnData;
}
