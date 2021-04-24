import { readFileSync, watch, writeFileSync } from "fs";
import format from "xml-formatter"
import { cases } from "./__tests__/cases";
import { convertToHTML } from "./src/old";
const build = () => {
    const template = readFileSync(cases.case1.template).toString();
    const input = JSON.parse(readFileSync(cases.case1.patterns[0].input).toString())
    const result = convertToHTML(template,input);
    const formatted = format(result,{
        collapseContent:true
    });
    writeFileSync(__dirname + "/dist/case1-1.html",formatted)
}
build()
watch(cases.case1.directory,{
    recursive:true
},build)
