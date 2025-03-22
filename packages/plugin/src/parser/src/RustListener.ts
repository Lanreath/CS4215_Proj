// Generated from src/Rust.g4 by ANTLR 4.13.1

import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { ProgContext } from "./RustParser.js";
import { ReplLineContext } from "./RustParser.js";
import { StatementContext } from "./RustParser.js";
import { VariableDeclarationContext } from "./RustParser.js";
import { FunctionDeclarationContext } from "./RustParser.js";
import { ParamListContext } from "./RustParser.js";
import { ParamContext } from "./RustParser.js";
import { BlockContext } from "./RustParser.js";
import { IfStatementContext } from "./RustParser.js";
import { ElifBranchContext } from "./RustParser.js";
import { ElseBranchContext } from "./RustParser.js";
import { WhileLoopContext } from "./RustParser.js";
import { AssignmentContext } from "./RustParser.js";
import { IdentifierContext } from "./RustParser.js";
import { BinaryOpContext } from "./RustParser.js";
import { UnaryOpContext } from "./RustParser.js";
import { ParenExprContext } from "./RustParser.js";
import { IntContext } from "./RustParser.js";
import { TypeContext } from "./RustParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `RustParser`.
 */
export class RustListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `RustParser.prog`.
     * @param ctx the parse tree
     */
    enterProg?: (ctx: ProgContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.prog`.
     * @param ctx the parse tree
     */
    exitProg?: (ctx: ProgContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.replLine`.
     * @param ctx the parse tree
     */
    enterReplLine?: (ctx: ReplLineContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.replLine`.
     * @param ctx the parse tree
     */
    exitReplLine?: (ctx: ReplLineContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.statement`.
     * @param ctx the parse tree
     */
    enterStatement?: (ctx: StatementContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.statement`.
     * @param ctx the parse tree
     */
    exitStatement?: (ctx: StatementContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.variableDeclaration`.
     * @param ctx the parse tree
     */
    enterVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.variableDeclaration`.
     * @param ctx the parse tree
     */
    exitVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.functionDeclaration`.
     * @param ctx the parse tree
     */
    enterFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.functionDeclaration`.
     * @param ctx the parse tree
     */
    exitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.paramList`.
     * @param ctx the parse tree
     */
    enterParamList?: (ctx: ParamListContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.paramList`.
     * @param ctx the parse tree
     */
    exitParamList?: (ctx: ParamListContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.param`.
     * @param ctx the parse tree
     */
    enterParam?: (ctx: ParamContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.param`.
     * @param ctx the parse tree
     */
    exitParam?: (ctx: ParamContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.block`.
     * @param ctx the parse tree
     */
    enterBlock?: (ctx: BlockContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.block`.
     * @param ctx the parse tree
     */
    exitBlock?: (ctx: BlockContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.ifStatement`.
     * @param ctx the parse tree
     */
    enterIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.ifStatement`.
     * @param ctx the parse tree
     */
    exitIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.elifBranch`.
     * @param ctx the parse tree
     */
    enterElifBranch?: (ctx: ElifBranchContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.elifBranch`.
     * @param ctx the parse tree
     */
    exitElifBranch?: (ctx: ElifBranchContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.elseBranch`.
     * @param ctx the parse tree
     */
    enterElseBranch?: (ctx: ElseBranchContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.elseBranch`.
     * @param ctx the parse tree
     */
    exitElseBranch?: (ctx: ElseBranchContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.whileLoop`.
     * @param ctx the parse tree
     */
    enterWhileLoop?: (ctx: WhileLoopContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.whileLoop`.
     * @param ctx the parse tree
     */
    exitWhileLoop?: (ctx: WhileLoopContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.assignment`.
     * @param ctx the parse tree
     */
    enterAssignment?: (ctx: AssignmentContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.assignment`.
     * @param ctx the parse tree
     */
    exitAssignment?: (ctx: AssignmentContext) => void;
    /**
     * Enter a parse tree produced by the `identifier`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterIdentifier?: (ctx: IdentifierContext) => void;
    /**
     * Exit a parse tree produced by the `identifier`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitIdentifier?: (ctx: IdentifierContext) => void;
    /**
     * Enter a parse tree produced by the `binaryOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterBinaryOp?: (ctx: BinaryOpContext) => void;
    /**
     * Exit a parse tree produced by the `binaryOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitBinaryOp?: (ctx: BinaryOpContext) => void;
    /**
     * Enter a parse tree produced by the `unaryOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterUnaryOp?: (ctx: UnaryOpContext) => void;
    /**
     * Exit a parse tree produced by the `unaryOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitUnaryOp?: (ctx: UnaryOpContext) => void;
    /**
     * Enter a parse tree produced by the `parenExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterParenExpr?: (ctx: ParenExprContext) => void;
    /**
     * Exit a parse tree produced by the `parenExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitParenExpr?: (ctx: ParenExprContext) => void;
    /**
     * Enter a parse tree produced by the `int`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterInt?: (ctx: IntContext) => void;
    /**
     * Exit a parse tree produced by the `int`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitInt?: (ctx: IntContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.type`.
     * @param ctx the parse tree
     */
    enterType?: (ctx: TypeContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.type`.
     * @param ctx the parse tree
     */
    exitType?: (ctx: TypeContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

