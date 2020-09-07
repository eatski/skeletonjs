import {generate} from "pegjs"
import { readFileSync } from "fs";
import * as t from "io-ts";
import { ValueIO, MultiplicativeOperatorIOs, AdditiveOperatorIOs, NumericalComparisonOperatorIOs, EquivalenceComparisonOperatorIOs } from "../core";
import { ToUnion } from "../util";

type InfixExpression<T extends string,I extends string,L> = {
    type:T,
    infix: I,
    left:L,
    right:InfixExpression<T,I,L> | L
}

export const toInfixExpressionIO = <
    T extends string,
    I extends [t.Mixed,t.Mixed,...t.Mixed[]],
    L extends t.Mixed,
>(type:T,infixes:I,left:L) :t.Type< {
    left:t.TypeOf<L>,
    type: T,
    right:t.TypeOf<L> | InfixExpression<T,ToUnion<I>,t.TypeOf<L>>,
    infix:t.TypeOf<t.UnionC<I>>
}> => {
    const io : t.Type< {
        left:t.TypeOf<L>,
        type: T,
        right:t.TypeOf<L> | InfixExpression<T,ToUnion<I>,t.TypeOf<L>>,
        infix:t.TypeOf<t.UnionC<I>>
    }> = t.recursion(type,() => t.type({
            type:t.literal(type),
            infix:t.union(infixes),
            left,
            right:t.union([left,io])
        })
    )
    return io
}


const MultiplicativeExpressionIO = toInfixExpressionIO(
    "MultiplicativeExpression",
    MultiplicativeOperatorIOs,
    ValueIO
)

export type UnfinalizedMultiplicativeExpression = t.TypeOf<typeof MultiplicativeExpressionIO>

const AddableIO = t.union([ValueIO,MultiplicativeExpressionIO])

const AdditiveExpressionIO = toInfixExpressionIO(
    "AdditiveExpression",
    AdditiveOperatorIOs,
    AddableIO
)

export type UnfinalizedAdditiveExpression = t.TypeOf<typeof AdditiveExpressionIO>
const NumericalComparableIO = t.union([AdditiveExpressionIO,AddableIO])

const  NumericalComparisonExpressionIO = toInfixExpressionIO(
    "NumericalComparisonExpression",
    NumericalComparisonOperatorIOs,
    NumericalComparableIO
)
export type UnfinalizedNumericalComparisonExpression = t.TypeOf<typeof NumericalComparisonExpressionIO>

const EquivalenceComparableIO = t.union([NumericalComparableIO,NumericalComparisonExpressionIO])

const EquivalenceComparisonExpressionIO = toInfixExpressionIO(
    "EquivalenceComparisonExpression",
    EquivalenceComparisonOperatorIOs,
    EquivalenceComparableIO
)
export type UnfinalizedEquivalenceComparisonExpression = t.TypeOf<typeof EquivalenceComparisonExpressionIO>
const UnfinalizedExpressionIO = t.union([EquivalenceComparableIO,EquivalenceComparisonExpressionIO])

export type UnfinalizedExpression =t.TypeOf<typeof UnfinalizedExpressionIO>
const parser = generate(readFileSync(__dirname + "/compare.pegjs").toString())
export const parse = (text:string) => {
    const res = UnfinalizedExpressionIO.decode(parser.parse(text))
    if(res._tag === "Right"){
        return res.right
    }
    throw res.left
}


