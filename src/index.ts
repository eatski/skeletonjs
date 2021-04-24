import { Variables } from "./domain/variables";
import { getLogger } from "log4js";
import { parseXMLMarkup } from "./parse/parseXMLMarkup";
import { exec } from "./core/exec";
import { finalizeToHTMLString } from "./finalize/finilizeToHtmlString";
import { defaultResolvers } from "./plugins/preset";

const logger = getLogger("skeletonjs");
logger.level = "debug";

//FIXME: 消す
export const e2eExec = (xmlString:string,variables:Variables) : string => {
    const input = parseXMLMarkup(xmlString);
    const res = exec(input, defaultResolvers, variables);
    return finalizeToHTMLString(res);
}
