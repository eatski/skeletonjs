import {generate} from "pegjs"
import { readFileSync } from "fs"

type Expression = ComparativeExpression | Value | AdditiveExpression

export const evalExpression = (exp:Expression | Value,resolve:VariableResolver): string | number | boolean => {
    switch (exp.type) {
        case "string":
            return exp.value;
        case "number":
            return exp.value;
        case "boolean":
            return exp.value;
        case "variable":
            return evalVariableValue(exp,resolve);
        case "AmbiguousComparativeExpression":
            return evalAmbiguousComparativeExpression(exp,resolve);
        case "BoolComparativeExpression":
            return evalBoolComparativeExpression(exp,resolve);
        case "StringComparativeExpression":
            return evalStringComparativeExpression(exp,resolve);
        case "NumberComparativeExpression":
            return evalNumberComparativeExpression(exp,resolve);
        case "AdditiveExpression":
            return evalAdditiveExpression(exp,resolve)
    }
} 

type ComparativeExpression = 
    StringComparativeExpression | 
    NumberComparativeExpression | 
    BoolComparativeExpression | 
    AmbiguousComparativeExpression

interface NumberComparativeExpression {
    type: "NumberComparativeExpression",
    infix: ">" | "<" | "==" | "!=" | ">=" | "<=",
    left: Computable,
    right: Computable
}

interface StringComparativeExpression {
    type: "StringComparativeExpression",
    infix: "==" | "!=",
    left: Stringified,
    right: Stringified
}

interface BoolComparativeExpression {
    type: "BoolComparativeExpression",
    infix: "==" | "!=",
    left: Logical,
    right: Logical
}

interface AmbiguousComparativeExpression {
    type: "AmbiguousComparativeExpression",
    infix: "==" | "!=",
    left: AnyValue,
    right: AnyValue
}
const evalComparativeExpression = (exp:ComparativeExpression,resolve:VariableResolver) : boolean=> {
    switch (exp.type) {
        case "AmbiguousComparativeExpression":
            return evalAmbiguousComparativeExpression(exp,resolve);
        case "BoolComparativeExpression":
            return evalBoolComparativeExpression(exp,resolve);
        case "StringComparativeExpression":
            return evalStringComparativeExpression(exp,resolve);
        case "NumberComparativeExpression":
            return evalNumberComparativeExpression(exp,resolve);
    }
}

const evalNumberComparativeExpression = (exp:NumberComparativeExpression,resolve:VariableResolver) : boolean=> {
    const left = evalComputable(exp.left,resolve);
    const right = evalComputable(exp.right,resolve);
    switch (exp.infix) {
        case "==":
            return left === right
        case "!=":
            return left !== right
        case　">":
            return left > right
        case　"<":
            return left < right
        case ">=":
            return left >= right
        case "<=":
            return left <= right
    }
}

const evalStringComparativeExpression = (exp:StringComparativeExpression,resolve:VariableResolver) : boolean=> {
    const left = evalStringified(exp.left,resolve);
    const right = evalStringified(exp.right,resolve);
    switch (exp.infix) {
        case "==":
            return left === right
        case "!=":
            return left !== right
    }
}

const evalBoolComparativeExpression = (exp:BoolComparativeExpression,resolve:VariableResolver) : boolean=> {
    const left = evalLogical(exp.left,resolve);
    const right = evalLogical(exp.right,resolve);
    switch (exp.infix) {
        case "==":
            return left === right
        case "!=":
            return left !== right
    }
}

const evalAmbiguousComparativeExpression = (exp:AmbiguousComparativeExpression,resolve:VariableResolver) : boolean => {
    throw new Error("TODO")
}

type AnyValue = VariableValue
type Stringified = StringValue | AnyValue
type Logical = BoolValue | AnyValue | ComparativeExpression
type Computable = VariableValue | NumberValue | AdditiveExpression

interface StringValue {
    type: "string" 
    value: string
}

interface VariableValue {
    prefix:null | "!",
    type: "variable" 
    value: string
}

interface NumberValue {
    type: "number" 
    value: number
}

interface BoolValue {
    type: "boolean" 
    value: boolean
}

interface VariableResolver {
    (name:string):number | string | boolean | undefined
}

const evalComputable = (computable:Computable,resolve:VariableResolver):number => {
    switch (computable.type) {
        case "number":            
            return computable.value;
        case "variable":
            return evalVariableValueAsNumber(computable,resolve);
        case "AdditiveExpression":
            return evalAdditiveExpression(computable,resolve);
    }
}

const evalStringified = (str:Stringified,resolve:VariableResolver):string => {
    switch (str.type) {
        case "string":            
            return str.value;
        case "variable":
            return evalVariableValueAsString(str,resolve);
    }
}

const evalLogical =  (logical:Logical,resolve:VariableResolver):boolean => {
    switch (logical.type) {
        case "boolean":            
            return logical.value;
        case "variable":
            return evalVariableValueAsBoolean(logical,resolve);
        default :
            return evalComparativeExpression(logical,resolve);
    }
}

const evalVariableValueAsNumber = (variable:VariableValue,resolve:VariableResolver):number => {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "number"){
        return value;
    }
    throw new Error(`[${variable.value}] is not number.`)
}
const evalVariableValueAsString = (variable:VariableValue,resolve:VariableResolver):string => {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "string"){
        return value;
    }
    throw new Error(`[${variable.value}] is not string.`)
}

const evalVariableValueAsBoolean = (variable:VariableValue,resolve:VariableResolver):boolean => {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "boolean"){
        return variable.prefix === "!" ? !value : value;
    }
    throw new Error(`[${variable.value}] is not boolean.`)
}

const evalVariableValue = (variable:VariableValue,resolve:VariableResolver):number | boolean | string=> {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "boolean"){
        return variable.prefix === "!" ? !value : value;
    }
    return value;
}


interface AdditiveExpression {
    type: "AdditiveExpression",
    infix: "+" | "-",
    left: Computable,
    right: Computable
}

const evalAdditiveExpression = (exp:AdditiveExpression,resolve:VariableResolver):number=> {
    const left = evalComputable(exp.left,resolve);
    const right = evalComputable(exp.right,resolve);
    switch (exp.infix) {
        case "+":
            return left + right;
        case "-":
            return left - right;
    }
}


type Value = StringValue | VariableValue | NumberValue | BoolValue


const parser = generate(readFileSync(__dirname + "/compare.pegjs").toString())
export const parse = (text:string) => {
    return parser.parse(text) as Expression
}




