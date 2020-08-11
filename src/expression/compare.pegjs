Start = Compare / Variable

Compare = left:ValueExp _ infix:Infix _ right:ValueExp {
    return  {
        type: "InfixExpression",
        infix,
        left,
        right
    }
}
ValueExp
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
  / [-]? NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

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
Infix
    = ">" / "<" / "==" / "!=" 


_ "whitespace"
  = [ \t\n\r]*