import { xml2js, Element } from "xml-js";
import { MarkupInput, InputElement } from "../domain/input";

export const parseXMLMarkup = (xml: string): MarkupInput => {
  const parsed = xml2js(xml) as Element;
  const res = xmlElementToMarkupInput(parsed);
  return {
    content: res instanceof Array ? res : [res]
  };
};


const xmlElementsToInputElement = (xmlElements: Element[]): InputElement | null => {
  const fn = (num: number = 0): InputElement | null => {
    const element = xmlElements[num];
    if (!element) {
      return null;
    }
    const input = xmlElementToMarkupInput(element);
    const next = fn(num + 1);

    return next ? {
      next,
      ...input
    } : input
  };
  return fn();
};

const UNEXPECTED = "Unexpected Parser Result";
export const xmlElementToMarkupInput = (xmlElement: Element): InputElement => {
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
      const res = xmlElementsToInputElement(xmlElement.elements);
      if (res === null) {
        throw new Error("elements is empty")
      }
      return res;
    }
    throw new Error(UNEXPECTED);
  }
  const parsed = parsePostTagName(xmlElement.name);
  if (parsed) {
    return {
      type: "PostElement",
      name: parsed,
      attrs: xmlElement.attributes,
      child:
        (xmlElement.elements &&
          xmlElementsToInputElement(xmlElement.elements)) ||
        undefined,
    };
  }
  return {
    type: "BasicElement",
    tag: xmlElement.name,
    attrs: xmlElement.attributes,
    child:
      (xmlElement.elements && xmlElementsToInputElement(xmlElement.elements)) ||
      undefined,
  };
};

export const parsePostTagName = (tag: string): string | null => {
  const res = /^sk:([a-z]+$)/.exec(tag);
  return res && res[1] ? res[1] : null;
};
