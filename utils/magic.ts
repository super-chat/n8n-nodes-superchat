import {
  IExecuteFunctions,
  IHookFunctions,
  INodeParameterResourceLocator,
  INodeProperties,
  INodePropertyCollection,
  INodePropertyOptions,
} from "n8n-workflow";

type ParameterName<Properties extends INodeProperties[]> =
  Properties[number]["name"];

export type FindPropertyByName<
  Properties extends INodeProperties[],
  Name extends ParameterName<Properties>,
> = Extract<Properties[number], { name: Name }>;

type PropertyCollectionType<
  Collection extends INodePropertyCollection,
  Multiple extends boolean,
> = Multiple extends true
  ? Record<
      Collection["values"][number]["name"],
      PropertyType<Collection["values"][number]>
    >[]
  : Record<
      Collection["values"][number]["name"],
      PropertyType<Collection["values"][number]>
    >;

export type PropertyType<Property extends INodeProperties> = Property extends {
  readonly type: "string";
}
  ? string
  : Property extends {
        readonly type: "dateTime";
      }
    ? string
    : Property extends {
          readonly type: "resourceLocator";
        }
      ? INodeParameterResourceLocator
      : Property extends {
            readonly type: "options";
            options: (infer X extends INodePropertyOptions)[];
            typeOptions: {
              multipleValues: true;
            };
          }
        ? X["value"][]
        : Property extends {
              readonly type: "options";
              options: (infer X extends INodePropertyOptions)[];
            }
          ? X["value"]
          : Property extends {
                readonly type: "fixedCollection";
                options: (infer X extends INodePropertyCollection)[];
                typeOptions: {
                  multipleValues: false;
                  maxValues: 1;
                };
              }
            ? Partial<Record<X["name"], PropertyCollectionType<X, false>>>
            : Property extends {
                  readonly type: "fixedCollection";
                  options: (infer X extends INodePropertyCollection)[];
                }
              ? Partial<Record<X["name"], PropertyCollectionType<X, true>>>
              : Property extends {
                    readonly type: "collection";
                    options: (infer X extends INodeProperties)[];
                  }
                ? Partial<Record<X["name"], PropertyType<X>>>
                : never;

function typesafeGetNodeParameter<
  Properties extends INodeProperties[],
  Name extends ParameterName<Properties>,
>(
  ctx: IExecuteFunctions | IHookFunctions,
  parameterName: Name,
  itemIndex?: number,
  fallbackValue?: any
) {
  type Output = PropertyType<FindPropertyByName<Properties, Name>>;

  if (itemIndex !== undefined) {
    return ctx.getNodeParameter(
      parameterName,
      itemIndex,
      fallbackValue
    ) as Output;
  }

  return ctx.getNodeParameter(parameterName, fallbackValue) as Output;
}

export function createTypesafeParameterGetter<
  Properties extends INodeProperties[],
>(properties: Properties) {
  return function <Name extends ParameterName<Properties>>(
    ctx: IExecuteFunctions | IHookFunctions,
    parameterName: Name,
    itemIndex?: number,
    fallbackValue?: any
  ): PropertyType<FindPropertyByName<Properties, Name>> {
    return typesafeGetNodeParameter(
      ctx,
      parameterName,
      itemIndex,
      fallbackValue
    );
  };
}
