import { Variables } from "./domain/variables";
import { getLogger } from "log4js";
import { parseXMLMarkup } from "./parse/parseXMLMarkup";
import { exec } from "./core/exec";
import { finalizeToHTMLString } from "./finalize/finilizeToHtmlString";
import { defaultResolvers } from "./plugins/preset";
import { FileSystemViewContainer } from "./domain/container";

const logger = getLogger("skeletonjs");
logger.level = "debug";

//FIXME: 消す
export const e2eExec = (entry:string,variables:Variables,root:string) : string => {
    const res = exec(entry, defaultResolvers, variables, new FileSystemViewContainer(root));
    return finalizeToHTMLString(res);
}
