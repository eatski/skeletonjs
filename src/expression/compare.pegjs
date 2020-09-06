{
    
    function getType(exp) {
        const dict = {
            "number":"number",
            "MultiplicativeExpression" : "number",
            "AdditiveExpression":"number",
            "variable":"variable"
        }
        const asis = dict[exp.type];
        if(!asis){
            throw new Error("型が登録されてないよ")
        }
        return asis;
    }
    function expectType(exp,tobe){
        const asis = getType(exp);
        if(asis !== tobe && asis !== "variable"){
            throw new Error("Invarid Type")
        }
    }
    function isComparable(left,right){
        const leftType = getType(left);
        const rightType = getType(right);
        return leftType == "variable" || rightType == "variable" || leftType == rightType
    }
}


Start = EquivalenceComparisonExpression / EquivalenceComparable

//Value > Grouping > Function > Multiplication > Addition > NumericalComparison > Equality

// ComparativeExpression

// ComparativeExpression = 
//     AmbiguousComparativeExpression /
//     NumberComparativeExpression / 
//     StringComparativeExpression /
//     BoolComparativeExpression 

// NumberComparativeExpression = left:Computable _ infix:NumberComparativeOperator _ right:Computable {
//     return  {
//         type: "NumberComparativeExpression",
//         infix,
//         left,
//         right
//     }
// }

// AmbiguousComparativeExpression = left:AnyValue _ infix:EqualityOperator _ right:AnyValue {
//     return  {
//         type: "AmbiguousComparativeExpression",
//         infix,
//         left,
//         right
//     }
// }

// StringComparativeExpression = left:Stringified _ infix:EqualityOperator _ right:Stringified {
//     return  {
//         type: "StringComparativeExpression",
//         infix,
//         left,
//         right
//     }
// }

// BoolComparativeExpression = left:BoolValue / AnyValue _ infix:EqualityOperator _ right:Logical {
//     return  {
//         type: "BoolComparativeExpression",
//         infix,
//         left,
//         right
//     }
// }


// NumberComparativeOperator
//     = EqualityOperator / ">" / "<" / ">=" / "<="

// EquivalenceComparison
EquivalenceComparisonExpression
    = left:EquivalenceComparable _ infix:EqualityOperator _ right:(EquivalenceComparisonExpression / EquivalenceComparable) {
        // const leftType = getType(left);
        // const rightType = getType(right);
        // if(leftType == "variable" && rightType == "variable"){
        //     return {
        //         type: "AmbiguousEquivalenceComparisonExpression",
        //         infix,
        //         left,
        //         right
        //     }
        // }
        // if((leftType == "string" && rightType == "string") || (leftType == "variable" && rightType == "string") || (leftType == "string" && rightType == "variable")){
        //     return {
        //         type: "StringEquivalenceComparisonExpression",
        //         infix,
        //         left,
        //         right
        //     }
        // }
        return  {
            type: "EquivalenceComparisonExpression",
            infix,
            left,
            right
        }
    }

EquivalenceComparable = NumericalComparisonExpression / NumericalComparable
EqualityOperator
    = "==" / "!="

// NumericalComparison
NumericalComparisonExpression 
    = left: NumericalComparable _ infix:NumericalComparisonOperator _ right:(NumericalComparisonExpression / NumericalComparable) {
        expectType(left,"number")
        expectType(right,"number")
        return  {
            type: "NumericalComparisonExpression",
            infix,
            left,
            right
        }
    }

NumericalComparable = AdditiveExpression / Addable
NumericalComparisonOperator = ">" / "<" / ">=" / "<="

// Addition

// Additive = NumberValue / AnyValue
// Computable = AdditiveExpression / Additive
// Stringified = StringValue / AnyValue
// Logical = ComparativeExpression / BoolValue / AnyValue

AdditiveExpression 
    = left:Addable _ infix:AdditiveOperator _ right:(AdditiveExpression / Addable) {
        expectType(left,"number")
        expectType(right,"number")
        return {
            type: "AdditiveExpression",
            infix,
            left,
            right
        }
    }

Addable = MultiplicativeExpression / Value

AdditiveOperator
    = "+" / "-"

// Multiplicative
MultiplicativeExpression
    = left:Multiplicable _ infix:MultiplicativeOperator _ right:(MultiplicativeExpression / Multiplicable) {
        expectType(left,"number")
        expectType(right,"number")
        return  {
            type: "MultiplicativeExpression",
            infix,
            left,
            right
        }
    }
Multiplicable = Value
MultiplicativeOperator = "*" / "/" / "%"

// Value
Value = NumberValue / StringValue / BoolValue / AnyValue

NumberValue
    = digits:DigitLiteral {
        return {
            type:"number",
            value:parseInt(digits.join(""))
        }
    }

StringValue
    = "'" charset:CharLiteral+ "'" { 
        return {
            type:"string",
            value:charset.join("")
        }
    }
BoolValue 
    = bool:BoolLiteral {
        return {
            type:"boolean",
            value: bool === "true"
        }
    }

AnyValue
    = Variable
Variable
    = &Keywords / prefix:VariablePrefix charset:[A-z]+{ 
        return {
            type:"variable",
            prefix,
            value:charset.join("")
        }
    }
VariablePrefix
    = [!]?

//Literal
Keywords = BoolLiteral 
BoolLiteral = "true" / "false"
DigitLiteral = "0" / [-]? [1-9] [0-9]*
CharLiteral = [^']



_ "whitespace"
  = [ \t\n\r]*