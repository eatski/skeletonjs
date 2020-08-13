Start = ComparativeExpression / AdditiveExpression / Value

// ComparativeExpression

ComparativeExpression = 
    AmbiguousComparativeExpression /
    NumberComparativeExpression / 
    StringComparativeExpression /
    BoolComparativeExpression 

NumberComparativeExpression = left:Computable _ infix:NumberComparativeOperator _ right:Computable {
    return  {
        type: "NumberComparativeExpression",
        infix,
        left,
        right
    }
}

AmbiguousComparativeExpression = left:AnyValue _ infix:EqualityOperator _ right:AnyValue {
    return  {
        type: "AmbiguousComparativeExpression",
        infix,
        left,
        right
    }
}

StringComparativeExpression = left:Stringified _ infix:EqualityOperator _ right:Stringified {
    return  {
        type: "StringComparativeExpression",
        infix,
        left,
        right
    }
}

BoolComparativeExpression = left:BoolValue / AnyValue _ infix:EqualityOperator _ right:Logical {
    return  {
        type: "BoolComparativeExpression",
        infix,
        left,
        right
    }
}

EqualityOperator
    = "==" / "!="
NumberComparativeOperator
    = EqualityOperator / ">" / "<" / ">=" / "<="


// AdditiveExpression

Additive = NumberValue / AnyValue
Computable = AdditiveExpression / Additive
Stringified = StringValue / AnyValue
Logical = ComparativeExpression / BoolValue / AnyValue


AdditiveExpression = left:Additive _ infix:AdditiveOperator _ right:Computable {
    return {
        type: "AdditiveExpression",
        infix,
        left,
        right
    }
}

AdditiveOperator
    = "+" / "-"

// Value
Value = NumberValue / StringValue / BoolValue / AnyValue

NumberValue
    = digits:Digit {
        return {
            type:"number",
            value:parseInt(digits.join(""))
        }
    }
Digit = "0" / [-]? [1-9] [0-9]*

StringValue
    = "'" charset:[A-z]+ "'" { 
        return {
            type:"string",
            value:charset.join("")
        }
    }


Keywords = 
    BoolLiteral 

BoolValue 
    = bool:BoolLiteral {
        return {
            type:"boolean",
            value: bool === "true"
        }
    }
BoolLiteral
    = "true" / "false"

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




_ "whitespace"
  = [ \t\n\r]*