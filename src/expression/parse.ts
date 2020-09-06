import {generate} from "pegjs"
import { readFileSync } from "fs";
import * as t from "io-ts";
import { toInfixExpressionIO } from "./util";

const BooleanIO = t.type({
    type:t.literal("boolean"),
    value: t.boolean
});
const NumberIO = t.type({
    type:t.literal("number"),
    value: t.number
})
const StringIO = t.type({
    type:t.literal("string"),
    value: t.string
})
const VariableIO = t.type({
    type:t.literal("variable"),
    prefix: t.union([t.nullType,t.literal("!")]),
    value: t.string
})
const ValueIO = t.union([BooleanIO,NumberIO,StringIO,VariableIO])
type Value = t.TypeOf<typeof ValueIO>

const MultiplicativeExpressionIO = toInfixExpressionIO(
    "MultiplicativeExpression",
    [t.literal("*"),t.literal("%"),t.literal("/")],
    ValueIO
)

type MultiplicativeExpression = t.TypeOf<typeof MultiplicativeExpressionIO>

const AddableIO = t.union([ValueIO,MultiplicativeExpressionIO])
type Addable = t.TypeOf<typeof AddableIO>

const AdditiveExpressionIO = toInfixExpressionIO(
    "AdditiveExpression",
    [t.literal("+"),t.literal("-")],
    AddableIO
)
type AdditiveExpression = t.TypeOf<typeof AdditiveExpressionIO>

const NumericalComparableIO = t.union([AdditiveExpressionIO,AddableIO])
type NumericalComparable = t.TypeOf<typeof NumericalComparableIO>

const  NumericalComparisonExpressionIO = toInfixExpressionIO(
    "NumericalComparisonExpression",
    [t.literal(">"),t.literal("<"),t.literal(">="),t.literal("<=")],
    NumericalComparableIO
)
const EquivalenceComparableIO = t.union([NumericalComparableIO,NumericalComparisonExpressionIO])

const EquivalenceComparisonExpressionIO = toInfixExpressionIO(
    "EquivalenceComparisonExpression",
    [t.literal("=="),t.literal("!=")],
    EquivalenceComparableIO
)

const ParsedExpressionIO = t.union([EquivalenceComparableIO,EquivalenceComparisonExpressionIO])

type ParsedExpression =t.TypeOf<typeof ParsedExpressionIO>
const parser = generate(readFileSync(__dirname + "/compare.pegjs").toString())
export const parse = (text:string) => {
    const res = ParsedExpressionIO.decode(parser.parse(text))
    if(res._tag === "Right"){
        return res.right
    }
    throw new Error("Unexpected Parse Error")
}

