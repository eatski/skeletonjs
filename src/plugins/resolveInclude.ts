import { flatMap } from "lodash";
import { ResolvePostElement } from "../domain/plugin";

export const resolveInclude: ResolvePostElement = (
  { attrs },
  { container },
  next
) => {
  if (!attrs || !(typeof attrs["name"] === "string")) {
    throw new Error(`
        Invalid Attribute:
        ${JSON.stringify(attrs)}
    `);
  }

    const input = container.getView(attrs["name"]);
    return flatMap(input,(e => next(e)))
};
