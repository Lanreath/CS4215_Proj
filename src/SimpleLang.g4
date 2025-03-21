grammar SimpleLang;

prog: statement* EOF;

statement
    : variableDeclaration
    | assignment
    | displayStatement
    | expressionStatement
    ;

variableDeclaration
    : ('const' | 'let' 'mut'?) IDENTIFIER '=' expression ';'
    ;

assignment
    : IDENTIFIER '=' expression ';'
    ;

displayStatement
    : 'display' '(' IDENTIFIER ')' ';'
    ;

expressionStatement
    : expression ';'
    ;

expression
    : '(' expression ')'
    | expression op=('*'|'/'|'+'|'-') expression
    | '&' 'mut'? IDENTIFIER
    | IDENTIFIER
    | INT
    ;

IDENTIFIER: [a-zA-Z_][a-zA-Z_0-9]*;
INT: [0-9]+;

WS: [ \t\r\n]+ -> skip;