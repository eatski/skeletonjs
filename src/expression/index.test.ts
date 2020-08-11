import { parse, evalExpression } from "."

test("文字列と数値が同じ値を持つ", () => {
    const res = parse("'aaa' == 3")
    const expected = {
        type: 'InfixExpression',
        infix: '==',
        left: { type: 'string', content: 'aaa' },
        right: { type: 'number', content: 3 }
    }
    expect(res).toEqual(expected)
})
test("文字列と変数が異なる", () => {
    const res = parse("'aa' != aa")
    const expected = {
        type: 'InfixExpression',
        infix: '!=',
        left: { type: 'string', content: 'aa' },
        right: { 
            type: 'variable', 
            prefix:null,
            content: 'aa' 
        }
    }
    expect(res).toEqual(expected)
})
test("変数単体 否定なし", () => {
    const res = parse("aaaa")
    const expected =  {
        type:"variable",
        prefix:null,
        content:"aaaa"
    }
    expect(res).toEqual(expected)
})
test("変数単体 否定あり", () => {
    const res = parse("!aaaa")
    const expected =  {
        type:"variable",
        prefix:"!",
        content:"aaaa"
    }
    expect(res).toEqual(expected)
})

test("比較 等価", () => {
    const parsed = parse("'aaa' == hoge");
    const parseExpected =  {
        type: 'InfixExpression',
        infix: '==',
        left: { type: 'string', content: 'aaa' },
        right: { type: 'variable', prefix:null, content: 'hoge' }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, (name) => {
        if(name !== 'hoge'){
            throw new Error();
        }
        return "aaa"
    });
    expect(evaled1).toBe(true)
    const evaled2 = evalExpression(parsed, (name) => {
        if(name !== 'hoge'){
            throw new Error();
        }
        return "aai"
    });
    expect(evaled2).toBe(false)
})
test("比較 大小", () => {
    const parsed = parse("num > 1");
    const parseExpected =  {
        type: 'InfixExpression',
        infix: '>',
        left: { type: 'variable', prefix:null, content: 'num' },
        right: { type: 'number', content: 1 }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, (name) => {
        if(name !== 'num'){
            throw new Error();
        }
        return 2
    });
    expect(evaled1).toBe(true)
    const evaled2 = evalExpression(parsed, (name) => {
        if(name !== 'num'){
            throw new Error();
        }
        return 1
    });
    expect(evaled2).toBe(false)
})
test("比較 大小 負の数", () => {
    const parsed = parse("num > -10");
    const parseExpected =  {
        type: 'InfixExpression',
        infix: '>',
        left: { type: 'variable', prefix:null, content: 'num' },
        right: { type: 'number', content: -10 }
    }
    expect(parsed).toEqual(parseExpected)
    const evaled1 = evalExpression(parsed, (name) => {
        if(name !== 'num'){
            throw new Error();
        }
        return -9
    });
    expect(evaled1).toBe(true)
    const evaled2 = evalExpression(parsed, (name) => {
        if(name !== 'num'){
            throw new Error();
        }
        return -10
    });
    expect(evaled2).toBe(false)
})