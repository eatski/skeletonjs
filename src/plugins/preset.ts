import { resolveCondition } from "./resolveCondition";
import { resolveIteratable } from "./resolveIteratable";

export const defaultResolvers = {
  each: resolveIteratable,
  if: resolveCondition,
};