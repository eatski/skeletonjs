import { flatMap } from "lodash";
import { evalExpression, parse } from "node-mel";
import { ResolvePostElement } from "../domain/plugin";

export const resolveCondition: ResolvePostElement = (
  { attrs, child },
  context,
  next
) => {
  if (!attrs || !(typeof attrs["cond"] === "string")) {
    throw new Error(`
        Invalid Attribute:
        ${JSON.stringify(attrs)}
        `);
  }

  if (!child) {
    return [];
  }

  const expression = attrs["cond"];
  const parsed = parse(expression);
  const result = evalExpression(parsed, name => context.variables.getPrimitiveValue(name))
  if (typeof result === "boolean") {
    return result ? next(child) : [];
  }
  throw new Error("result must be boolean.")

};
