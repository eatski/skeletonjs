import * as t from "io-ts";
export type ToUnion<T extends [t.Mixed,t.Mixed,...t.Mixed[]]> = t.TypeOf<t.UnionC<T>>
export const asConstMixed = <T extends [t.Mixed,t.Mixed,...t.Mixed[]]>(arg:T):T => arg