import {generate} from "pegjs"
import { readFileSync } from "fs"

interface InfixExpression {
    type: "InfixExpression",
    infix: ">" | "<" | "==" | "!=",
    left: Value,
    right: Value
}

type Value = StringValue | VariableValue | NumberValue | BoolValue

type StaticValue = Exclude<Value,VariableValue>

interface StringValue {
    type: "string" 
    content: string
}

interface VariableValue {
    prefix:null | "!",
    type: "variable" 
    content: string
}

interface NumberValue {
    type: "number" 
    content: number
}

interface BoolValue {
    type: "boolean" 
    content: boolean
}

const parser = generate(readFileSync(__dirname + "/compare.peg").toString())
export const parse = (text:string) : InfixExpression | VariableValue=> {
    return parser.parse(text) as InfixExpression | VariableValue
}

interface ResolveVariable {
    (variableName:string) : string | number | boolean
}
export const evalValueExpression = (value:Value,resolve:ResolveVariable):StaticValue => {
    if(value.type != "variable"){
        return value;
    }
    const resolved = resolve(value.content);
    switch (typeof resolved) {
        case "boolean":
            return {
                type:"boolean",
                content:value.prefix === "!" ? !resolved : resolved
            }
        case "number":
            if(value.prefix != null){
                throw new Error(`invalid prefix ${value.prefix}`)
            }
            return {
                type:"number",
                content:resolved
            }
        case "string":
            if(value.prefix != null){
                throw new Error(`invalid prefix ${value.prefix}`)
            }
            return {
                type:"string",
                content:resolved
            }
        default:
            throw new Error(`[${value.content} is invalid Type ${typeof resolved}`)
    }
}

export const evalExpression = (exp:InfixExpression | Value,resolve:ResolveVariable): string | number | boolean => {
    switch (exp.type) {
        case "InfixExpression":
            return evalInfixExpression(exp,resolve);
        default:
            return evalValueExpression(exp,resolve).content;
    }
} 

export const evalInfixExpression = (exp:InfixExpression,resolve:ResolveVariable): string | number | boolean => {
    const left = evalValueExpression(exp.left,resolve);
    const right = evalValueExpression(exp.right,resolve);
    switch (exp.infix) {
        case "==":
            return left.content === right.content
        case "!=":
            return left.content !== right.content
        case　">":
            return left.content > right.content
        case　"<":
            return left.content < right.content
    }
}