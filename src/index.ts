import {xml2js,js2xml, Element} from "xml-js";
import {flatten} from "lodash";
import {parse} from "mustache";
import {parse as parseExp, evalExpression} from "./expression"
import { VariablesWrapper, Variables } from "./variables";
import {getLogger} from "log4js";

const logger = getLogger("skeletonjs")
logger.level = "debug"


type SkContext = {
    variables:VariablesWrapper
}

const resolveText = (text:string,{variables}:SkContext):string => {
    return parse(text).map(cur => {
        const [type,text] = cur;
        return  type === "name" ? variables.getTextValue(text) : text;
    }).join();
}

const resolvePrimitiveElement = (element:Element,context: SkContext):Element  => {
    return {
        type:element.type,
        name:element.name,
        attributes:element.attributes,
        text:element.text ? resolveText(element.text.toString(),context) : undefined,
        elements: element.elements ? resolveElement(element.elements,context) : undefined
    }
}


const resolveElement = (elements:Element[],context: SkContext):Element[] => {
    return elements.reduce<Element[]>((prev,cur) => { 
        const res = resolveSingleElement(cur,context)
        return prev.concat(res instanceof Array ? res : [res]);
    },[])
}

const resolveSingleElement = (element:Element,context: SkContext):Element | Element[] => {
    
    if(element.type === "text" && typeof element.text === "string"){
        return {
            type:"text",
            text:resolveText(element.text,context)
        }
    }
    if(element.name === "sk:each"){
        const ref = element.attributes && element.attributes["ref"];
        const item = element.attributes && element.attributes["item"] 
        if(typeof ref === "string" && typeof item === "string"){
            const variables = context.variables.getArrayValue(ref);
            return flatten(
                variables.map(v => resolveElement(element.elements || [], {
                    ...context,
                    variables:context.variables.addVariables({[item]:v})
                }))
            )
        }
        throw new Error(JSON.stringify(element))
    }
    if(element.name === "sk:if"){
        const expression = element.attributes && element.attributes["expression"];
        if(typeof expression === "string"){
            const parsed = parseExp(expression);
            const result = evalExpression(parsed,(name) => {
                return context.variables.getPrimitiveValue(name);
            })
            if(typeof result === "boolean"){
                return result && element.elements ? resolveElement(element.elements,context) : []
            }
        }
        throw new Error(JSON.stringify(element))
    } 
    if(element.name === undefined){
        return resolveElement(element.elements || [],context)
    }
    logger.debug(`is this primitive??=>${JSON.stringify(element)}`)
    return resolvePrimitiveElement(element,context)
}

export const convertToHTML = (xml:string,variables:Variables):string => {
    const parsed = xml2js(xml) as Element;
    const resolved = resolveElement([parsed],{variables: new VariablesWrapper(variables)})
    return js2xml({elements:resolved})
}

