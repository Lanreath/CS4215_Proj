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
    : IDENTIFIER '=' expression ';'                 # standardAssignment
    | '*' target=expression '=' value=expression ';'  # dereferenceAssignment
    ;

expressionStatement
    : expression ';'
    ;

// Order of operations
expression
    : '(' expression ')'                               # parenExpr
    | '&' 'mut'? target=expression                     # referenceExpr
    | '*' target=expression                            # dereferenceExpr
    | left=expression op=('>'|'>='|'<'|'<='|'=='|'!=') right=expression  # equalityOp
    | left=expression op=('*'|'/') right=expression    # mulDivOp
    | left=expression op=('+'|'-') right=expression    # addSubOp
    | '-' operand=expression                           # unaryOp
    | IDENTIFIER                                       # identifier
    | INT                                              # int
    ;

// Updated to include reference types
type
    : 'i64'                # integerType
    | '&' 'mut'? type      # referenceType
    ;

IDENTIFIER: [a-zA-Z_][a-zA-Z_0-9]*;
INT: [0-9]+;

WS: [ \t\r\n]+ -> skip;