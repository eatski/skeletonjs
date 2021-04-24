import { resolveCondition } from "./resolveCondition";
import { resolveInclude } from "./resolveInclude";
import { resolveIteratable } from "./resolveIteratable";

export const defaultResolvers = {
  each: resolveIteratable,
    if: resolveCondition,
  include: resolveInclude
};