import { convertToHTML } from "../src"
import { readFileSync } from "fs"
import {cases} from "./cases"

test("Case 1",() => {
    const template = readFileSync(cases.case1.template).toString();
    const input = JSON.parse(readFileSync(cases.case1.patterns[0].input).toString())
    const result = convertToHTML(template,input);
    const snapshot = readFileSync(cases.case1.patterns[0].expected).toString();
    expect(result).toBe(snapshot);
})