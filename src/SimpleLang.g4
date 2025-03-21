grammar SimpleLang;

prog: statement* EOF;

statement
    : variableDeclaration
    | assignment
    | displayStatement
    | expression
    ;

variableDeclaration
    : ('const' | 'let') IDENTIFIER '=' expression ';'
    ;

assignment
    : IDENTIFIER '=' expression ';'
    ;

displayStatement
    : 'display' '(' IDENTIFIER ')' ';'
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