import * as t from "io-ts";
type InfixExpression<T extends string,I extends string,L> = {
    type:T,
    infix: I,
    left:L,
    right:InfixExpression<T,I,L> | L
}

type ToUnion<T extends readonly [t.Mixed,t.Mixed,...t.Mixed[]]> = t.TypeOf<t.UnionC<Writable<T>>>

type Writable<T> = {
    -readonly [P in keyof T]: T[P]
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