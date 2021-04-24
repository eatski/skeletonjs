import { readFileSync } from "fs"
import {cases} from "./cases"
import { e2eExec } from "../src";
import { xml2js } from "xml-js";

test("Case 1",() => {
    const variables = JSON.parse(readFileSync(cases.case1.patterns[0].input).toString())
    const result = e2eExec(cases.case1.template, variables,cases.case1.directory);
    const snapshot = readFileSync(cases.case1.patterns[0].expected).toString();
    expect(xml2js(result)).toEqual(xml2js(snapshot));
})