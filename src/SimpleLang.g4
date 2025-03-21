grammar SimpleLang;

prog: statement* EOF;

statement
    : variableDeclaration
    | assignment
    | printStatement
    | expression
    ;

variableDeclaration
    : 'const' IDENTIFIER '=' expression ';'
    ;

assignment
    : IDENTIFIER '=' expression ';'
    ;

printStatement
    : 'print' '(' IDENTIFIER ')' ';'
    ;

expression
    : '(' expression ')'
    | expression op=('*'|'/'|'+'|'-') expression
    | IDENTIFIER
    | INT
    ;

IDENTIFIER: [a-zA-Z_][a-zA-Z_0-9]*;
INT: [0-9]+;

WS: [ \t\r\n]+ -> skip;