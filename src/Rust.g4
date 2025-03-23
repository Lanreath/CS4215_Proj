grammar Rust;

prog: statement* EOF;

statement
    : variableDeclaration
    | functionDeclaration
    | assignment
    | block
    | ifStatement
    | whileStatement
    | expressionStatement
    ;

variableDeclaration
    : 'let' mutFlag='mut'? name=IDENTIFIER ':' type '=' value=expression ';'
    ;

functionDeclaration
    : 'fn' name=IDENTIFIER '(' paramList? ')'  '->' returnType=type functionBody=block
    ;

paramList
    : param (',' param)*
    ;

param
    : name=IDENTIFIER ':' type
    ;

block
    : '{' statement* expression? '}'
    ;

ifStatement
    : 'if' condition=expression thenBlock=block elseBranch? ';'
    ;

elseBranch
    : 'else' block
    | 'else' ifStatement
    ;

whileStatement
    : 'while' condition=expression loopBlock=block
    ;

assignment
    : IDENTIFIER '=' expression ';'
    ;

expressionStatement
    : expression ';'
    ;

// Order of operations
expression
    : '(' expression ')' # parenExpr
    | left=expression op=('>'|'>='|'<'|'<='|'=='|'!=') right=expression  # equalityOp
    | left=expression op=('*'|'/') right=expression # mulDivOp
    | left=expression op=('+'|'-') right=expression # addSubOp
    | '-' operand=expression # unaryOp
    | IDENTIFIER # identifier
    | INT # int
    ;

// Hardcoded until type checker is implemented
type
    : 'i64'
    ;

IDENTIFIER: [a-zA-Z_][a-zA-Z_0-9]*;
INT: [0-9]+;

WS: [ \t\r\n]+ -> skip;