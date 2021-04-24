import { readFileSync } from "fs"
import {cases} from "./cases"
import { e2eExec } from "../src";

test("Case 1",() => {
    const template = readFileSync(cases.case1.template).toString();
    const variables = JSON.parse(readFileSync(cases.case1.patterns[0].input).toString())
    const result = e2eExec(template, variables);
    const snapshot = readFileSync(cases.case1.patterns[0].expected).toString();
    expect(result).toBe(snapshot);
})