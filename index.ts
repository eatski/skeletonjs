import {xml2js,js2xml, Element} from "xml-js";
import {readFileSync,writeFileSync} from "fs";
import {flatten} from "lodash";
import {parse} from "mustache"

const input = readFileSync("./sample.html").toString();
const parsed = xml2js(input)

type SkContext = Record<string,string | string[] | undefined>

const resolveText = (text:string,context:SkContext):string => {
    return parse(text).reduce((prev,cur) => {
        const [type,text] = cur;
        if(type === "name"){    
            const variable = context[text]
            if(variable){
                return prev + variable
            }
            throw new Error(`Variable [${text}] not found`);
        }
        return prev + text;
    },"")
}

const toArray = (e:Element | Element[]):Element[] => {
    if( e instanceof Array){
        return e
    } else {
        return [e]
    } 
}

const resolvePrimitiveElement = (element:Element,context: SkContext):Element  => {
    return {
        type:element.type,
        name:element.name,
        attributes:element.attributes,
        text:element.text ? resolveText(element.text.toString(),context) : undefined,
        elements: element.elements ? toArray(resolveElement(element.elements,context)) : undefined
    }
}


const resolveElement = (elements:Element | Element[],context: SkContext):Element | Element[] => {
    if( elements instanceof Array){
        return flatten(elements.map(element => resolveSingleElement(element,context)))
    } else {
        return resolveSingleElement(elements,context);
    }
}

const resolveSingleElement = (element:Element,context: SkContext):Element | Element[] => {
    
    if(element.type === "text" && typeof element.text === "string"){
        return {
            type:"text",
            text:resolveText(element.text,context)
        }
    }
    if(element.name === "sk:each"){
        console.log("sk:each")
        const ref = element.attributes && element.attributes["ref"];
        const item = element.attributes && element.attributes["item"] 
        if(typeof ref === "string" && typeof item === "string"){
            const variable = context[ref];
            if(variable && typeof variable === "object"){
                return flatten(variable.map(v => resolveElement(element.elements || [],{
                    ...context,
                    [item]:v
                }))) 
            }
        }
        throw new Error(JSON.stringify(element))
    } 
    if(element.name === undefined){
        return resolveElement(element.elements || [],context)
    }
    console.log("is this primitive??=>",element)
    return resolvePrimitiveElement(element,context)
}

try {
    const resolved = resolveElement(parsed as Element,{list:["aaa","fuga"]})
    console.log(JSON.stringify(resolved));
    writeFileSync("./dist/_sample.html",js2xml({elements:resolved}));
} catch(e) {
    console.log("error");
    console.log(e)
}

