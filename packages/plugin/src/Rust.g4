grammar Rust;

prog: statement* EOF;

statement
    : variableDeclaration
    | functionDeclaration
    | assignment
    | block
    | ifStatement
    | whileLoop
    | expression ';'
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
    : '{' statement* '}'
    ;

ifStatement
    : 'if' condition=expression thenBlock=block elifBranch* elseBranch?
    ;

elifBranch
    : 'else' 'if' condition=expression thenBlock=block
    ;

elseBranch
    : 'else' elseBlock=block
    ;

whileLoop
    : 'while' condition=expression loopBody=block
    ;

assignment
    : IDENTIFIER '=' expression ';'
    ;

expression
    : '(' expression ')' # parenExpr
    | left=expression op=('*'|'/'|'+'|'-'|'>'|'<'|'=='|'!=') right=expression  # binaryOp
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