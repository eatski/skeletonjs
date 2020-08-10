import { convertToHTML } from "../src"
import { readFileSync } from "fs"

test("Case 1",() => {
    const input = readFileSync(__dirname + "/files/sample.html").toString();
    const result = convertToHTML(input,{list:["hoge","fuga"]});
    const snapshot = readFileSync(__dirname + "/files/sample.snap.html").toString();
    expect(result).toBe(snapshot);
})