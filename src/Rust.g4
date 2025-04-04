grammar Rust;

prog: statement* EOF;

statement
    : variableDeclaration
    | functionDeclaration
    | assignment
    | block
    | ifStatement
    | whileStatement
    | returnStatement
    | breakStatement       
    | expressionStatement
    ;

returnStatement
    : 'return' expression? ';'
    ;

variableDeclaration
    : 'let' mutFlag='mut'? name=IDENTIFIER ':' type '=' value=expression ';'
    ;

functionDeclaration
    : 'fn' name=IDENTIFIER '(' paramList? ')'  '->' returnType=type? functionBody=block
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
    : IDENTIFIER '=' expression ';'                 # standardAssignment
    | '*' target=expression '=' value=expression ';'  # dereferenceAssignment
    ;

expressionStatement
    : expression ';'
    ;

// Expression precedence levels (updated to include booleans)
expression
    : INT                     # int
    | BOOL                    # bool
    | IDENTIFIER              # identifier
    | '(' expression ')'      # parenExpr
    | '-' expression          # unaryOp
    | '!' expression          # logicalNotOp
    | expression op=('*'|'/') expression # mulDivOp
    | expression op=('+'|'-') expression # addSubOp
    | expression op=('<'|'<='|'>'|'>=') expression # equalityOp
    | expression op=('=='|'!=') expression # equalityOp
    | expression op='&&' expression      # logicalAndOp
    | expression op='||' expression      # logicalOrOp
    | IDENTIFIER '(' argList? ')'        # functionCall   
    | '&' mutFlag='mut'? target=expression # referenceExpr
    | '*' target=expression              # dereferenceExpr
    ;

argList
    : expression (',' expression)*
    ;

// Updated to include both integer and boolean types
type
    : (refFlag='&' mutFlag='mut'?)? ('i64' | 'bool')
    ;

breakStatement
    : 'break' ';'
    ;

BOOL: 'true' | 'false';
IDENTIFIER: [a-zA-Z_][a-zA-Z_0-9]*;
INT: [0-9]+;

WS: [ \t\r\n]+ -> skip;