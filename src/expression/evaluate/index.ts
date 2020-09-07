import { Expression, NumberResolvable, AdditiveExpression, StringResolvable, BooleanResolvable, EquivalenceComparisonExpression, AnyEquivalenceComparisonExpression, StringEquivalenceComparisonExpression, BooleanEquivalenceComparisonExpression, NumberEquivalenceComparisonExpression, NumericalComparisonExpression, MultiplicativeExpression } from "../types";
import { Variable } from "../core";

export const evalExpression = (exp:Expression ,resolve:VariableResolver): string | number | boolean => {
    switch (exp.type) {
        case "variable":
            return evalVariable(exp,resolve);
        case "MultiplicativeExpression":
        case "AdditiveExpression":
        case "number":
            return evalNumberResolvable(exp,resolve)
        case "AnyEquivalenceComparisonExpression":
        case "BooleanEquivalenceComparisonExpression":
        case "NumberEquivalenceComparisonExpression":
        case "NumericalComparisonExpression":
        case "StringEquivalenceComparisonExpression":
        case "boolean":
            return evalBooleanResolvable(exp,resolve)
        case "string":
            return evalStringResolvable(exp,resolve)
    }
} 

const evalNumberEquivalenceComparisonExpression = (exp:NumberEquivalenceComparisonExpression,resolve:VariableResolver) : boolean=> {
    const _0 = evalNumberResolvable(exp._0,resolve);
    const _1 = evalNumberResolvable(exp._1,resolve);
    switch (exp.op) {
        case "==":
            return _0 === _1
        case "!=":
            return _0 !== _1
    }
}

const evalNumericalComparisonExpression = (exp:NumericalComparisonExpression,resolve:VariableResolver) : boolean => {
    const _0 = evalNumberResolvable(exp._0,resolve);
    const _1 = evalNumberResolvable(exp._1,resolve);
    switch (exp.op) {
        case "<":
            return _0 < _1;
        case ">":
            return _0 > _1;
        case "<=":
            return _0 <= _1;
        case ">=":
            return _0 >= _1
    }
}

const evalStringEquivalenceComparisonExpression = (exp:StringEquivalenceComparisonExpression,resolve:VariableResolver) : boolean=> {
    const _0 = evalStringResolvable(exp._0,resolve);
    const _1 = evalStringResolvable(exp._1,resolve);
    switch (exp.op) {
        case "==":
            return _0 === _1
        case "!=":
            return _0 !== _1
    }
}

const evalBooleanEquivalenceComparisonExpression = (exp:BooleanEquivalenceComparisonExpression,resolve:VariableResolver) : boolean=> {
    const _0 = evalBooleanResolvable(exp._0,resolve);
    const _1 = evalBooleanResolvable(exp._1,resolve);
    switch (exp.op) {
        case "==":
            return _0 === _1
        case "!=":
            return _0 !== _1
    }
}

const evalAnyEquivalenceComparisonExpression = (exp:AnyEquivalenceComparisonExpression,resolve:VariableResolver) : boolean => {
    throw new Error("TODO")
}
interface VariableResolver {
    (name:string):number | string | boolean | undefined
}

const evalNumberResolvable = (expression:NumberResolvable,resolve:VariableResolver):number => {
    switch (expression.type) {
        case "number":            
            return expression.value;
        case "variable":
            return evalVariableAsNumber(expression,resolve);
        case "AdditiveExpression":
            return evalAdditiveExpression(expression,resolve);
        case "MultiplicativeExpression":
            return evalMultiplicativeExpression(expression,resolve);
    }
}

const evalStringResolvable = (str:StringResolvable,resolve:VariableResolver):string => {
    switch (str.type) {
        case "string":            
            return str.value;
        case "variable":
            return evalVariableAsString(str,resolve);
    }
}

const evalBooleanResolvable = (expression:BooleanResolvable,resolve:VariableResolver):boolean => {
    switch (expression.type) {
        case "boolean":            
            return expression.value;
        case "variable":
            return evalVariableAsBoolean(expression,resolve);
        case "AnyEquivalenceComparisonExpression":
            return evalAnyEquivalenceComparisonExpression(expression,resolve)
        case "BooleanEquivalenceComparisonExpression":
            return evalBooleanEquivalenceComparisonExpression(expression,resolve)
        case "NumberEquivalenceComparisonExpression":
            return evalNumberEquivalenceComparisonExpression(expression,resolve)
        case "NumericalComparisonExpression":
            return evalNumericalComparisonExpression(expression,resolve)
        case "StringEquivalenceComparisonExpression":
            return evalStringEquivalenceComparisonExpression(expression,resolve)
    }
}

const evalVariableAsNumber = (variable:Variable,resolve:VariableResolver):number => {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "number"){
        return value;
    }
    throw new Error(`[${variable.value}] is not number.`)
}
const evalVariableAsString = (variable:Variable,resolve:VariableResolver):string => {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "string"){
        return value;
    }
    throw new Error(`[${variable.value}] is not string.`)
}

const evalVariableAsBoolean = (variable:Variable,resolve:VariableResolver):boolean => {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "boolean"){
        return variable.prefix === "!" ? !value : value;
    }
    throw new Error(`[${variable.value}] is not boolean.`)
}

const evalVariable = (variable:Variable,resolve:VariableResolver):number | boolean | string=> {
    const value = resolve(variable.value)
    if(typeof value === "undefined"){
        throw new Error(`[${variable.value}] is undefined.`)
    }
    if(typeof value === "boolean"){
        return variable.prefix === "!" ? !value : value;
    }
    return value;
}

const evalAdditiveExpression = (exp:AdditiveExpression,resolve:VariableResolver):number=> {
    const _0 = evalNumberResolvable(exp._0,resolve);
    const _1 = evalNumberResolvable(exp._1,resolve);
    switch (exp.op) {
        case "+":
            return _0 + _1;
        case "-":
            return _0 - _1;
    }
}

const evalMultiplicativeExpression = (exp:MultiplicativeExpression,resolve:VariableResolver):number=> {
    const _0 = evalNumberResolvable(exp._0,resolve);
    const _1 = evalNumberResolvable(exp._1,resolve);
    switch (exp.op) {
        case "*":
            return _0 * _1;
        case "/":
            return _0 / _1;
        case "%":
            return _0 % _1
    }
}






