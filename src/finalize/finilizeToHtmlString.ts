import { js2xml, Element } from "xml-js";
import { OutputElement, RenderingOutput } from "../domain/output";

export const convertToXMLElement = (output:OutputElement): Element => {
    if (output.tag !== null) {
        return {
          type: "element",
          name: output.tag,
          attributes: output.attrs,
          elements: output.children?.map(convertToXMLElement),
        };
    }
    return {
        type: "text",
        text: output.content
    }
};

export const finalizeToHTMLString = (output: RenderingOutput): string => {
  const elements = output.contents.map(convertToXMLElement);  
  return js2xml({ elements });
};
