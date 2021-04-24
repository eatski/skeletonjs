import { parsePostTagName } from "./parseXMLMarkup"

test("parseTagName", () => {
  expect(parsePostTagName("sk:hoge")).toBe("hoge");
  expect(parsePostTagName("hoge")).toBe(null);
});