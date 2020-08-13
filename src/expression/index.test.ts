import { parse, evalExpression } from "."

test("文字列と数値が同じ値を持つ", () => {
    const res = parse("'aaa' == 'aa'")
    const expected = {
        type: 'StringComparativeExpression',
        infix: '==',
        left: { type: 'string', value: 'aaa' },
        right: { type: 'string', value: 'aa' }
    }
    expect(res).toEqual(expected)
})
test("文字列と変数が異なる", () => {
    const res = parse("'山田 太郎' != aa")
    const expected = {
        type: 'StringComparativeExpression',
        infix: '!=',
        left: { type: 'string', value: '山田 太郎' },
        right: { 
            type: 'variable', 
            prefix:null,
            value: 'aa' 
        }
    }
    expect(res).toEqual(expected)
})
test("変数単体 否定なし", () => {
    const res = parse("aaaa")
    const expected =  {
        type:"variable",
        prefix:null,
        value:"aaaa"
    }
    expect(res).toEqual(expected)
})
test("変数単体 否定あり", () => {
    const res = parse("!aaaa")
    const expected =  {
        type:"variable",
        prefix:"!",
        value:"aaaa"
    }
    expect(res).toEqual(expected)
})

test("比較 等価", () => {
    const parsed = parse("'aaa' == hoge");
    const parseExpected =  {
        type: 'StringComparativeExpression',
        infix: '==',
        left: { type: 'string', value: 'aaa' },
        right: { type: 'variable', prefix:null, value: 'hoge' }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, name => name === 'hoge' ? "aaa" : undefined);
    expect(evaled1).toBe(true)
    const evaled2 = evalExpression(parsed, name => name === 'hoge' ? "aai" : undefined);
    expect(evaled2).toBe(false)
})
test("比較 大小", () => {
    const parsed = parse("num > 1");
    const parseExpected =  {
        type: 'NumberComparativeExpression',
        infix: '>',
        left: { type: 'variable', prefix:null, value: 'num' },
        right: { type: 'number', value: 1 }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, name => name === 'num' ? 2 : undefined);
    expect(evaled1).toBe(true)
    const evaled2 = evalExpression(parsed, name => name === 'num' ? 1 : undefined);
    expect(evaled2).toBe(false)
})
test("比較 大小 負の数", () => {
    const parsed = parse("num > -10");
    const parseExpected =  {
        type: 'NumberComparativeExpression',
        infix: '>',
        left: { type: 'variable', prefix:null, value: 'num' },
        right: { type: 'number', value: -10 }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, name => name === 'num' ? -9 : undefined);
    expect(evaled1).toBe(true)
    const evaled2 = evalExpression(parsed, name => name === 'num' ? -10 : undefined);
    expect(evaled2).toBe(false)
})
test("比較 文法エラー", () => {
    expect(() => parse("'aaa' > -10")).toThrowError()
    expect(() => parse("false > -10")).toThrowError()
})
test("True False",() => {
    const parsedFalse = parse("false");
    const parseExpectedFalse =  { type: 'boolean', value: false }
    expect(parsedFalse).toEqual(parseExpectedFalse);
    const parsedTrue = parse("true");
    const parseExpectedTrue =  { type: 'boolean', value: true }
    expect(parsedTrue).toEqual(parseExpectedTrue);
})
test("加算", () => {
    const parsed = parse("num + -10");
    const parseExpected =  {
        type: 'AdditiveExpression',
        infix: '+',
        left: { type: 'variable', prefix:null, value: 'num' },
        right: { type: 'number', value: -10 }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, name => name === 'num' ? 15 : undefined);
    expect(evaled1).toBe(5)
    const evaled2 = evalExpression(parsed, name => name === 'num' ? -10 : undefined);
    expect(evaled2).toBe(-20)
})

test("加算3つ", () => {
    const parsed = parse("num + -10 - 1");
    const parseExpected =  {
        type: 'AdditiveExpression',
        infix: '+',
        left: { type: 'variable', prefix:null, value: 'num' },
        right: { 
            type: 'AdditiveExpression', 
            infix: '-',
            left: {
                type:"number",
                value:-10
            },
            right: {
                type:"number",
                value:1
            }
        }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, name => name === 'num' ? 15 : undefined);
    expect(evaled1).toBe(4)
    const evaled2 = evalExpression(parsed, name => name === 'num' ? -10 : undefined);
    expect(evaled2).toBe(-21)
})
