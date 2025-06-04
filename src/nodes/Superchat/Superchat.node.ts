import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeConnectionType,
} from "n8n-workflow";
import { superchatApiRequest } from "./GenericFunctions";
import { match } from "ts-pattern";
import { ContactHandleType } from "../../types/ContactHandleType";
import { PAWriteContactHandleDTO } from "../../types/PAWriteContactHandleDTO";
import { PACreateContactDTO } from "../../types/PACreateContactDTO";

const RESOURCE_OPTIONS = [
  {
    name: "User",
    value: "user",
    description: "A Superchat user",
  },
  {
    name: "Contact",
    value: "contact",
    description: "A Superchat contact",
  },
] as const;

const USER_OPERATION_OPTIONS = [
  {
    value: "me",
    name: "Identify Yourself",
    action: "Retrieve the information about yourself as a superchat user",
  },
] as const;

const CONTACT_OPERATION_OPTIONS = [
  {
    value: "search",
    name: "Search For A Contact",
    action: "Search a contact by any field.",
  },
  {
    value: "delete",
    name: "Delete A Contact",
    action: "Delete a contact in Superchat.",
  },
  {
    value: "create",
    name: "Create A Contact",
    action: "Create a new contact in Superchat.",
  },
] as const;

type ResourceKey = (typeof RESOURCE_OPTIONS)[number]["value"];
type UserOperationKey = (typeof USER_OPERATION_OPTIONS)[number]["value"];
type ContactOperationKey = (typeof CONTACT_OPERATION_OPTIONS)[number]["value"];

type OperationKeyByResource<R extends ResourceKey> = {
  user: UserOperationKey;
  contact: ContactOperationKey;
}[R];

export class Superchat implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Superchat",
    name: "superchat",
    icon: "file:superchat.svg",
    documentationUrl: "https://developers.superchat.com/",
    group: ["transform"],
    version: 1,
    subtitle:
      '={{$parameter["resource"].toTitleCase() + ": " + $parameter["operation"].toTitleCase()}}',
    description: "Retrieve data from the Superchat API",
    defaults: {
      name: "Superchat",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "superchatApi",
        required: true,
      },
    ],

    properties: [
      // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        options: [...RESOURCE_OPTIONS],
        default: "user" satisfies ResourceKey,
        noDataExpression: true,
        required: true,
      },

      // ----------------------------------
      //         user
      // ----------------------------------
      // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        required: true,
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["user" satisfies ResourceKey],
          },
        },
        options: [...USER_OPERATION_OPTIONS],
        default: "me" satisfies UserOperationKey,
      },

      // ----------------------------------
      //         contact
      // ----------------------------------
      // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        required: true,
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["contact" satisfies ResourceKey],
          },
        },
        options: [...CONTACT_OPERATION_OPTIONS],
        default: "search" satisfies ContactOperationKey,
      },

      // ----------------------------------
      //         contact:search
      // ----------------------------------
      {
        displayName: "Search Field",
        displayOptions: {
          show: {
            resource: ["contact" satisfies ResourceKey],
            operation: ["search" satisfies ContactOperationKey],
          },
        },
        name: "field",
        type: "options",
        options: [
          {
            name: "Email Address",
            value: "mail",
            description: "Search by email address",
          },
          {
            name: "Phone Number",
            value: "phone",
            description: "Search by phone number",
          },
          {
            name: "Instagram Handle",
            value: "instagram",
            description: "Search by Instagram handle",
          },
        ],
        default: "mail",
        required: true,
        description: "Field to search by",
      },
      {
        displayName: "Value",
        displayOptions: {
          show: {
            resource: ["contact" satisfies ResourceKey],
            operation: ["search" satisfies ContactOperationKey],
          },
        },
        name: "value",
        type: "string",
        default: "",
        required: true,
        description: "Value to search for",
      },

      // ----------------------------------
      //         contact:delete
      // ----------------------------------
      {
        displayName: "ID",
        displayOptions: {
          show: {
            resource: ["contact" satisfies ResourceKey],
            operation: ["delete" satisfies ContactOperationKey],
          },
        },
        name: "id",
        type: "string",
        default: "",
        required: true,
        description: "ID of the contact to delete",
      },

      // ----------------------------------
      //         contact:create
      // ----------------------------------
      {
        displayName: "First Name",
        displayOptions: {
          show: {
            resource: ["contact" satisfies ResourceKey],
            operation: ["create" satisfies ContactOperationKey],
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
            operation: ["create" satisfies ContactOperationKey],
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
            operation: ["create" satisfies ContactOperationKey],
          },
        },
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
        displayOptions: {
          show: {
            resource: ["contact" satisfies ResourceKey],
            operation: ["create" satisfies ContactOperationKey],
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
            operation: ["create" satisfies ContactOperationKey],
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
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: any[] = [];

    const resource = this.getNodeParameter("resource", 0) as ResourceKey;

    for (let i = 0; i < items.length; i++) {
      await match(resource)
        .with("user", async (resource) => {
          const operation = this.getNodeParameter(
            "operation",
            0
          ) as OperationKeyByResource<typeof resource>;

          await match(operation)
            .with("me", async (operation) => {
              const responseData = await superchatApiRequest.call(
                this,
                "GET",
                "/me",
                {}
              );
              returnData.push(responseData);
            })
            .exhaustive();
        })
        .with("contact", async (resource) => {
          const operation = this.getNodeParameter(
            "operation",
            0
          ) as OperationKeyByResource<typeof resource>;

          await match(operation)
            .with("search", async () => {
              const field = this.getNodeParameter("field", i) as string;
              const value = this.getNodeParameter("value", i) as string;

              const responseData = await superchatApiRequest.call(
                this,
                "POST",
                "/contacts/search",
                {
                  query: {
                    value: [
                      {
                        field,
                        operator: "=",
                        value,
                      },
                    ],
                  },
                }
              );

              returnData.push(responseData);
            })
            .with("delete", async () => {
              const id = this.getNodeParameter("id", i) as string;

              const responseData = await superchatApiRequest.call(
                this,
                "DELETE",
                `/contacts/${id}`,
                {}
              );

              returnData.push(responseData);
            })
            .with("create", async () => {
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
            })
            .exhaustive();
        })
        .exhaustive();
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
