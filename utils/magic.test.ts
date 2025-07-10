import { IExecuteFunctions, INodeProperties } from "n8n-workflow";
import {
  createTypesafeParameterGetter,
  FindPropertyByName,
  PropertyType,
} from "./magic";

const EXAMPLE_PROPERTIES = [
  {
    displayName: "First Name",
    name: "firstName",
    type: "string",
    default: "",
    description: "The first name of the contact",
  },
  {
    displayName: "Birthday",
    name: "birthday",
    type: "dateTime",
    default: "",
    description: "The birthday of the contact",
  },
  {
    displayName: "Gender",
    name: "gender",
    type: "options",
    options: [
      { name: "Female", value: "female" },
      { name: "Male", value: "male" },
    ],
    default: "female",
    description: "The gender of the contact",
  },
  {
    displayName: "Color",
    name: "color",
    type: "options",
    options: [
      { name: "Blue", value: "blue" },
      { name: "Red", value: "red" },
    ],
    default: "red",
    description: "The color of an item",
    typeOptions: {
      multipleValues: true,
    },
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
    displayName: "Channel ID",
    name: "channelId",
    type: "resourceLocator",
    default: { mode: "list" },
    description: "The ID of the channel to send the message from",
    required: true,
    modes: [
      {
        displayName: "ID",
        name: "id",
        type: "string",
        hint: "Enter an ID",
      },
      {
        displayName: "List",
        name: "list",
        type: "list",
        typeOptions: {
          searchListMethod: "messageChannelSearch",
          searchable: false,
          searchFilterRequired: false,
        },
      },
    ],
  },
  {
    displayName: "Labels",
    name: "labelIds",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add Label",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Label",
            name: "id",
            type: "resourceLocator",
            default: { mode: "list" },
            description: "A label",
            modes: [
              {
                displayName: "ID",
                name: "id",
                type: "string",
                hint: "Enter an ID",
              },
              {
                displayName: "List",
                name: "list",
                type: "list",
                typeOptions: {
                  searchListMethod: "labelSearch",
                  searchable: false,
                  searchFilterRequired: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    displayName: "Filter by Conversation Status",
    name: "conversationStatus",
    type: "fixedCollection",
    default: { values: [] },
    placeholder: "Add Conversation Status",
    description:
      "Only listen for conversation status changes based on the status they changed to",
    typeOptions: {
      multipleValues: true,
    },
    options: [
      {
        displayName: "Values",
        name: "values",
        values: [
          {
            displayName: "Conversation Status",
            name: "id",
            type: "options",
            // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options
            default: "",
            hint: "Only applicable for conversation status changed events",
            options: [
              {
                name: "Done",
                value: "done",
              },
              {
                name: "Open",
                value: "open",
              },
              {
                name: "Snoozed",
                value: "snoozed",
              },
            ],
          },
        ],
      },
    ],
  },
] as const satisfies INodeProperties[];

type FirstNameProperty = FindPropertyByName<
  typeof EXAMPLE_PROPERTIES,
  "firstName"
>;

// @ts-expect-error: FirstNamePropertyType is not used
type FirstNamePropertyType = PropertyType<FirstNameProperty>;

type GenderProperty = FindPropertyByName<typeof EXAMPLE_PROPERTIES, "gender">;

// @ts-expect-error: GenderPropertyType is not used
type GenderPropertyType = PropertyType<GenderProperty>;

type EmailsProperty = FindPropertyByName<typeof EXAMPLE_PROPERTIES, "emails">;

// @ts-expect-error: EmailsPropertyType is not used
type EmailsPropertyType = PropertyType<EmailsProperty>;

const CTX = {} as IExecuteFunctions;

const propertyGetter = createTypesafeParameterGetter(EXAMPLE_PROPERTIES);

{
  // @ts-expect-error: firstName is not used
  let firstName = propertyGetter(CTX, "firstName", 0);

  firstName = "John"; // This is valid as the type is string

  // @ts-expect-error: firstName is expected to be a string
  firstName = 123;
}

{
  // @ts-expect-error: firstName is not used
  let birthday = propertyGetter(CTX, "birthday", 0);

  birthday = "John"; // This is valid as the type is string

  // @ts-expect-error: birthday is expected to be a string
  birthday = 123;
}

{
  // @ts-expect-error: gender is not used
  let gender = propertyGetter(CTX, "gender", 0);

  gender = "male"; // This is valid as the type is "male" | "female"

  // @ts-expect-error: gender is expected to be a string literal type
  gender = "123";
}

{
  // @ts-expect-error: color is not used
  let color = propertyGetter(CTX, "color", 0);

  color = ["blue"]; // This is valid as the type is ("blue" | "red")[]

  // @ts-expect-error: color is expected to be an array of string literal types
  color = ["123"];

  // @ts-expect-error: invalid as it is a string, not an array
  color = "blue, red";
}

{
  // @ts-expect-error: emails is not used
  let emails = propertyGetter(CTX, "emails", 0);

  emails = {
    values: [{ value: "123" }],
  };
}

{
  // @ts-expect-error: color is not used
  let channelId = propertyGetter(CTX, "channelId", 0);

  channelId = {
    mode: "id",
    __rl: {} as any,
    value: "123",
  }; // This is valid as the type is INodeParameterResourceLocator

  // @ts-expect-error: channelId is expected to be an INodeParameterResourceLocator
  channelId = "123";
}

{
  // @ts-expect-error: color is not used
  let labelIds = propertyGetter(CTX, "labelIds", 0);

  labelIds = {
    values: [
      {
        id: {
          mode: "id",
          __rl: {} as any,
          value: "123",
        },
      },
    ],
  }; // This is valid as the type is { values: { id: INodeParameterResourceLocator }[] }

  // @ts-expect-error: labelIds is expected to be an { values: { id: INodeParameterResourceLocator }[] }
  labelIds = "123";
}

{
  // @ts-expect-error: color is not used
  let conversationStatus = propertyGetter(CTX, "conversationStatus", 0);

  conversationStatus = {
    values: [
      {
        id: "done",
      },
    ],
  }; // This is valid as the type is { values: { id: "done" | "open" | "snoozed" }[] }

  // @ts-expect-error: conversationStatus is expected to be an { values: { id: "done" | "open" | "snoozed" }[] }
  conversationStatus = "test";

  conversationStatus = {
    values: [
      {
        // @ts-expect-error: id is expected to be "done" | "open" | "snoozed"
        id: "test",
      },
    ],
  };
}

{
  // @ts-expect-error: Invalid parameter name
  propertyGetter(CTX, "123", 0);
}
