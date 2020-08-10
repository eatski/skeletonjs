import {generate} from "pegjs"
import { readFileSync } from "fs"

interface CompareExpression {
    type: "CompareExpression",
    infix: ">" | "<" | "==" | "!=",
    left: Comparable,
    right: Comparable
}
type Comparable = ComparableString | ComparableVariable | ComparableNumber

interface ComparableString {
    type: "string" 
    content: string
}

interface ComparableVariable {
    type: "variable" 
    content: string
}

interface ComparableNumber {
    type: "number" 
    content: number
}

const parser = generate(readFileSync(__dirname + "/compare.peg").toString())
export const parse = (text:string) : CompareExpression=> {
    return parser.parse(text) as CompareExpression
}