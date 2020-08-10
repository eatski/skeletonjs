import { parse } from "."

test("文字列と数値が同じ値を持つ", () => {
    const res = parse("'aaa' == 3")
    const expected = {
        type: 'CompareExpression',
        infix: '==',
        left: { type: 'string', content: 'aaa' },
        right: { type: 'number', content: 3 }
    }
    expect(res).toEqual(expected)
})
test("文字列と変数が異なる", () => {
    const res = parse("'aa' != aa")
    const expected = {
        type: 'CompareExpression',
        infix: '!=',
        left: { type: 'string', content: 'aa' },
        right: { type: 'variable', content: 'aa' }
    }
    expect(res).toEqual(expected)
})