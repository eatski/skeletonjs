export interface MarkupInput {
    content: InputElement[];
}

export type InputElement = InputBasicElement | InputPostElement | InputTextElement;

export interface InputBasicElement {
  type: "BasicElement";
  tag: string;
  attrs?: Record<string, string | number | undefined>;
  child?: InputElement;
  next?: InputElement;
}

export interface InputTextElement {
  type: "TextElement";
  content: string;
  next?: InputElement;
}

export interface InputPostElement {
  type: "PostElement";
  name: string;
  attrs?: Record<string, string | number | undefined>;
  child?: InputElement;
  next?: InputElement;
}