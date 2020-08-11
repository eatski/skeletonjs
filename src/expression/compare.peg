start = compare / variable

compare = left:comparable _ infix:infix _ right:comparable {
    return  {
        type: "InfixExpression",
        infix,
        left,
        right
    }
}
comparable
    = number / string / variable
number
    = digits:[0-9]+ { 
        return {
            type:"number",
            content:parseInt(digits.join(""))
        }
    }
string
    = "'" charset:[A-z]+ "'" { 
        return {
            type:"string",
            content:charset.join("")
        }
    }
variable
    = prefix:prefix charset:[A-z]+{ 
        return {
            type:"variable",
            prefix,
            content:charset.join("")
        }
    }
prefix
    = [!]?
infix
    = ">" / "<" / "==" / "!=" 

_ "whitespace"
  = [ \t\n\r]*