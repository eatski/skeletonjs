import { readFileSync } from "fs";
import path from "path";
import { parseXMLMarkup } from "../parse/parseXMLMarkup";
import { InputElement } from "./input";

export interface ViewContainer {
    getView(name:string) : InputElement[]
}

export class FileSystemViewContainer implements ViewContainer  {

    constructor(private root:string) {}

    getView(name: string): InputElement[] {
        const absPath = path.resolve(this.root, name);
        const xml = parseXMLMarkup(readFileSync(absPath).toString());
        return xml.content
    }
}