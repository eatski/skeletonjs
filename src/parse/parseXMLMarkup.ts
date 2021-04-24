
import { flatMap } from "lodash";
import { xml2js, Element } from "xml-js";
import { MarkupInput, InputElement } from "../domain/input";

export const parseXMLMarkup = (xml: string): MarkupInput => {
  const parsed = xml2js(xml) as Element;
  const res = xmlElementToMarkupInput(parsed);
  return {
    content: res instanceof Array ? res : [res]
  };
};

const UNEXPECTED = "Unexpected Parser Result";
export const xmlElementToMarkupInput = (xmlElement: Element): InputElement| InputElement[] => {
  if (xmlElement.type === "text") {
    if (typeof xmlElement.text !== "string") {
      throw new Error("入力エラー: " + xmlElement.text);
    }
    return {
      type: "TextElement",
      content: xmlElement.text,
    };
  }
  if (!xmlElement.name) {
    if (xmlElement.elements) {
      return flatMap(xmlElement.elements, xmlElementToMarkupInput);
    }
    throw new Error(UNEXPECTED);
  }
  const parsed = parsePostTagName(xmlElement.name);
  if (parsed) {
    return {
      type: "PostElement",
      name: parsed,
      attrs: xmlElement.attributes,
      children: xmlElement.elements
        ? flatMap(xmlElement.elements, xmlElementToMarkupInput)
        : undefined,
    };
  }
  return {
    type: "BasicElement",
    tag: xmlElement.name,
    attrs: xmlElement.attributes,
    children: xmlElement.elements
      ? flatMap(xmlElement.elements, xmlElementToMarkupInput)
      : undefined,
  };
};

export const parsePostTagName = (tag: string): string | null => {
  const res = /^sk:([a-z]+$)/.exec(tag);
  return res && res[1] ? res[1] : null;
};
