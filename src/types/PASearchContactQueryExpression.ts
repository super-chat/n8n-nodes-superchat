import { PASearchContactQueryExpressionInstagram } from "./PASearchContactQueryExpressionInstagram";
import { PASearchContactQueryExpressionMail } from "./PASearchContactQueryExpressionMail";
import { PASearchContactQueryExpressionPhone } from "./PASearchContactQueryExpressionPhone";

export type PASearchContactQueryExpression =
  | PASearchContactQueryExpressionMail
  | PASearchContactQueryExpressionPhone
  | PASearchContactQueryExpressionInstagram;
