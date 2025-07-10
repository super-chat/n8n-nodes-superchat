import { PASearchContactQueryExpressionOperator } from "./PASearchContactQueryExpressionOperator";

export type PASearchContactQueryExpressionMail = {
  field: "mail";
  operator: PASearchContactQueryExpressionOperator;
  value: string;
};
