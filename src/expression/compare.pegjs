Start = ComparativeExpression / ValueExpression

ComparativeExpression = left:ValueExpression _ infix:ComparativeOperator _ right:ValueExpression {
    return  {
        type: "ComparativeExpression",
        infix,
        left,
        right
    }
}
ValueExpression
    = Number / String / Variable
Number
    = digits:Digit {
        return {
            type:"number",
            content:parseInt(digits.join(""))
        }
    }
Digit
  = "0"
  / [-]? [1-9] [0-9]*

String
    = "'" charset:[A-z]+ "'" { 
        return {
            type:"string",
            content:charset.join("")
        }
    }
Variable
    = prefix:VariablePrefix charset:[A-z]+{ 
        return {
            type:"variable",
            prefix,
            content:charset.join("")
        }
    }
VariablePrefix
    = [!]?
ComparativeOperator
    = ">" / "<" / "==" / "!=" / ">=" / "<="


_ "whitespace"
  = [ \t\n\r]*