import { VariablesWrapper } from "../domain/variables";
import { ViewContainer } from "./container";

export interface RenderingContext {
  variables: VariablesWrapper;
  container: ViewContainer;
}


