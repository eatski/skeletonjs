import { parse } from "mustache";
import { RenderingContext } from "../domain/context";

export const resolveText = (text: string, { variables }: RenderingContext): string => {
  return parse(text)
    .map((cur) => {
      const [type, text] = cur;
      return type === "name" ? variables.getTextValue(text) : text;
    })
    .join();
};
