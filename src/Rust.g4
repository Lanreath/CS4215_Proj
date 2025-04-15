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
    : 'fn' name=IDENTIFIER '(' paramList? ')'  ('->' returnType=type)? functionBody=block
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
    : 'if' condition=expression thenBlock=block elseBranch?
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
    | left=expression op=('*'|'/') right=expression # mulDivOp
    | left=expression op=('+'|'-') right=expression # addSubOp
    | left=expression op=('<'|'<='|'>'|'>=') right=expression # comparatorOp
    | left=expression op=('=='|'!=') right=expression # equalityOp
    | left=expression op='&&' right=expression      # logicalAndOp
    | left=expression op='||' right=expression      # logicalOrOp
    | IDENTIFIER '(' argList? ')'        # functionCall   
    | '&' mutFlag='mut'? target=expression # referenceExpr
    | '*' target=expression              # dereferenceExpr
    ;

argList
    : expression (',' expression)*
    ;

type
    : referenceType
    | atomicType
    ;

referenceType
    : '&' mutFlag='mut'? baseType=type
    ;

atomicType: 'i32' | 'bool';

breakStatement
    : 'break' ';'
    ;

BOOL: 'true' | 'false';
IDENTIFIER: [a-zA-Z_][a-zA-Z_0-9]*;
INT: [0-9]+;

WS: [ \t\r\n]+ -> skip;