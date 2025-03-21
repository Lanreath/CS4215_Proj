grammar SimpleLang;

prog: statement* EOF;

statement
    : variableDeclaration
    | assignment
    | displayStatement
    | expressionStatement
    ;

variableDeclaration
    : ('const' | 'let') MUT? IDENTIFIER '=' expression ';'
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
    | '&' MUT? IDENTIFIER
    | IDENTIFIER
    | INT
    ;

IDENTIFIER: [a-zA-Z_][a-zA-Z_0-9]*;
INT: [0-9]+;

MUT: 'mut';
CONST: 'const';
LET: 'let';
DISPLAY: 'display';

WS: [ \t\r\n]+ -> skip;