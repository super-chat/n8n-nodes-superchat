import { PASearchContactQueryExpressionOperator } from "./PASearchContactQueryExpressionOperator";

export type PASearchContactQueryExpressionPhone = {
  field: "phone";
  operator: PASearchContactQueryExpressionOperator;
  value: string;
};
