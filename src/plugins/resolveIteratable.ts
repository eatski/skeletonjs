import { flatMap } from "lodash";
import { ResolvePostElement } from "../domain/plugin";

export const resolveIteratable: ResolvePostElement = ({attrs,child},context,next) => {
    
    if(!attrs || !attrs["as"] || !(typeof attrs["in"] === "string")){
        throw new Error(`
        Invalid Attribute:
        ${JSON.stringify(attrs)}
        ` )
    }

    if (!child) {
      return [];
    }
    
    const as = attrs["as"];
    const inAttr = attrs["in"];
    const variables = context.variables.getArrayValue(inAttr);
    return flatMap(variables,(v) => {
      const newContext = {
        ...context,
        variables: context.variables.addVariables({ [as]: v }),
      };
      return next(child, newContext);
    });
    
}