import { InputElement, InputPostElement } from "./input";
import { OutputElement } from "./output";
import {RenderingContext} from "./context"

export type ResolvePostElement = (
  element: InputPostElement,
  context: RenderingContext,
  next: (
    element: InputElement,
    context?: RenderingContext
  ) => OutputElement[] | OutputElement
) => OutputElement[] | OutputElement;