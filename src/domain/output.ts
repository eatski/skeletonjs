export interface RenderingOutput {
  contents: OutputElement[];
}

export type OutputElement = OutputTagElement | OutputTextElement;

type OutputTagElement = {
  tag: string;
  attrs?: Record<string, string | number | undefined>;
  children?: OutputElement[];
}

type OutputTextElement = {
  tag: null;
  content: string
};