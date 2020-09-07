import { UnfinalizedExpression,UnfinalizedAdditiveExpression, UnfinalizedMultiplicativeExpression, UnfinalizedNumericalComparisonExpression, UnfinalizedEquivalenceComparisonExpression } from "./parse"
import { NumberResolvable, Expression, MultiplicativeExpression, AdditiveExpression, NumericalComparisonExpression, BooleanResolvable, StringResolvable, EquivalenceComparisonExpression } from "../types"
import { Number, Variable, Boolean, String } from "../core"

type UnfinalizedNumberResolvable = Number | UnfinalizedAdditiveExpression | UnfinalizedMultiplicativeExpression | Variable
const narrowToUnfinalizedNumberResolvable = (expression:UnfinalizedExpression):UnfinalizedNumberResolvable | false => {
    switch (expression.type) {
        case "AdditiveExpression":
        case "MultiplicativeExpression":
        case "number":
        case "variable":
            return expression
    }
    return false
}
const finalizeNumberResolvable = (parsed:UnfinalizedNumberResolvable) : NumberResolvable =>{
    switch (parsed.type) {
        case "number":
        case "variable":
            return parsed;
        case "MultiplicativeExpression":
            return finalizeMultiplicativeExpression(parsed)
        case "AdditiveExpression":
            return finalizeAdditiveExpression(parsed)
    }
} 
const narrowToUnfinalizedBooleanResolvable = (expression:UnfinalizedExpression):UnfinalizedBooleanResolvable | false => {
    switch (expression.type) {
        case "boolean":
        case "variable":
        case "EquivalenceComparisonExpression":
        case "NumericalComparisonExpression":
            return expression
    }
    return false
}
type UnfinalizedBooleanResolvable = Boolean | UnfinalizedEquivalenceComparisonExpression | UnfinalizedNumericalComparisonExpression | Variable
const finalizeBooleanResolvable = (parsed:UnfinalizedBooleanResolvable) : BooleanResolvable =>{
    switch (parsed.type) {
        case "boolean":
        case "variable":
            return parsed;
        case "NumericalComparisonExpression":
            return finalizeNumericalComparisonExpression(parsed)
        case "EquivalenceComparisonExpression":
            return finalizeEquivalenceComparisonExpression(parsed)
    }
}

type UnfinalizedStringResolvable = String | Variable
const narrowToUnfinalizedStringResolvable = (expression:UnfinalizedExpression):UnfinalizedStringResolvable | false => {
    switch (expression.type) {
        case "string":
        case "variable":
            return expression
    }
    return false
}
const finalizeStringResolvable = (parsed:UnfinalizedStringResolvable) : StringResolvable =>{
    switch (parsed.type) {
        case "string":
        case "variable":
            return parsed;
    }
}

export const finalize = (expression:UnfinalizedExpression):Expression => {
    if(expression.type === "variable") return expression //FIXME: 
    const number = narrowToUnfinalizedNumberResolvable(expression)
    if(number) return finalizeNumberResolvable(number)
    const boolean = narrowToUnfinalizedBooleanResolvable(expression)
    if(boolean) return finalizeBooleanResolvable(boolean)
    const string = narrowToUnfinalizedStringResolvable(expression)
    if(string) return finalizeStringResolvable(string)
    throw new Error("Unreachable") //FIXME: Unreachable
}

const finalizeMultiplicativeExpression = ({type,left,right,infix}:UnfinalizedMultiplicativeExpression):MultiplicativeExpression => {
    const narrowedLeft = narrowToUnfinalizedNumberResolvable(left)
    const narrowedRight = narrowToUnfinalizedNumberResolvable(right)
    if(narrowedLeft && narrowedRight) {
        const _left = finalizeNumberResolvable(narrowedLeft);
        const _right = finalizeNumberResolvable(narrowedRight);
        return {
            type,
            op:infix,
            _0:_left,
            _1:_right
        }
    }
    throw new Error()
}

const finalizeAdditiveExpression = ({type,left,right,infix}:UnfinalizedAdditiveExpression):AdditiveExpression => {
    const narrowedLeft = narrowToUnfinalizedNumberResolvable(left)
    const narrowedRight = narrowToUnfinalizedNumberResolvable(right)
    if(narrowedLeft && narrowedRight) {
        const _left = finalizeNumberResolvable(narrowedLeft);
        const _right = finalizeNumberResolvable(narrowedRight);
        return {
            type,
            op:infix,
            _0:_left,
            _1:_right
        }
    }
    throw new Error()
}

const finalizeNumericalComparisonExpression = ({type,left,right,infix}:UnfinalizedNumericalComparisonExpression):NumericalComparisonExpression => {
    const narrowedLeft = narrowToUnfinalizedNumberResolvable(left)
    const narrowedRight = narrowToUnfinalizedNumberResolvable(right)
    if(narrowedLeft && narrowedRight) {
        const _left = finalizeNumberResolvable(narrowedLeft);
        const _right = finalizeNumberResolvable(narrowedRight);
        return {
            type,
            op:infix,
            _0:_left,
            _1:_right
        }
    }
    throw new Error()
}

const finalizeEquivalenceComparisonExpression = (expression:UnfinalizedEquivalenceComparisonExpression):EquivalenceComparisonExpression => {
    const {left,right,infix} = expression
    if(left.type === "variable" && right.type === "variable"){
        return {
            type:"AnyEquivalenceComparisonExpression",
            op:infix,
            _0:left,
            _1:right
        }
    }
    const numberLeft = narrowToUnfinalizedNumberResolvable(left)
    const numberRight = narrowToUnfinalizedNumberResolvable(right)
    if(numberLeft && numberRight){
        return {
            type:"NumberEquivalenceComparisonExpression",
            op:infix,
            _0:finalizeNumberResolvable(numberLeft),
            _1:finalizeNumberResolvable(numberRight)
        }
    }
    const booleanLeft = narrowToUnfinalizedBooleanResolvable(left);
    const booleanRight = narrowToUnfinalizedBooleanResolvable(right);
    if(booleanLeft && booleanRight){
        return {
            type:"BooleanEquivalenceComparisonExpression",
            op:infix,
            _0:finalizeBooleanResolvable(booleanLeft),
            _1:finalizeBooleanResolvable(booleanRight)
        }
    }
    const stringLeft = narrowToUnfinalizedStringResolvable(left);
    const stringRight = narrowToUnfinalizedStringResolvable(right);
    if(stringLeft && stringRight){
        return {
            type:"StringEquivalenceComparisonExpression",
            op:infix,
            _0:finalizeStringResolvable(stringLeft),
            _1:finalizeStringResolvable(stringRight)
        }
    }
    throw new Error("Unreachable") //FIXME: Unreachable
}