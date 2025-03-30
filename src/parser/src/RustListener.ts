// Generated from src/Rust.g4 by ANTLR 4.13.1

import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { ProgContext } from "./RustParser.js";
import { StatementContext } from "./RustParser.js";
import { ReturnStatementContext } from "./RustParser.js";
import { VariableDeclarationContext } from "./RustParser.js";
import { FunctionDeclarationContext } from "./RustParser.js";
import { ParamListContext } from "./RustParser.js";
import { ParamContext } from "./RustParser.js";
import { BlockContext } from "./RustParser.js";
import { IfStatementContext } from "./RustParser.js";
import { ElseBranchContext } from "./RustParser.js";
import { WhileStatementContext } from "./RustParser.js";
import { StandardAssignmentContext } from "./RustParser.js";
import { DereferenceAssignmentContext } from "./RustParser.js";
import { ExpressionStatementContext } from "./RustParser.js";
import { IdentifierContext } from "./RustParser.js";
import { DereferenceExprContext } from "./RustParser.js";
import { ReferenceExprContext } from "./RustParser.js";
import { EqualityOpContext } from "./RustParser.js";
import { FunctionCallContext } from "./RustParser.js";
import { UnaryOpContext } from "./RustParser.js";
import { MulDivOpContext } from "./RustParser.js";
import { IntContext } from "./RustParser.js";
import { ParenExprContext } from "./RustParser.js";
import { AddSubOpContext } from "./RustParser.js";
import { ArgListContext } from "./RustParser.js";
import { TypeContext } from "./RustParser.js";
import { BreakStatementContext } from "./RustParser.js";


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
     * Enter a parse tree produced by `RustParser.returnStatement`.
     * @param ctx the parse tree
     */
    enterReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.returnStatement`.
     * @param ctx the parse tree
     */
    exitReturnStatement?: (ctx: ReturnStatementContext) => void;
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
     * Enter a parse tree produced by `RustParser.whileStatement`.
     * @param ctx the parse tree
     */
    enterWhileStatement?: (ctx: WhileStatementContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.whileStatement`.
     * @param ctx the parse tree
     */
    exitWhileStatement?: (ctx: WhileStatementContext) => void;
    /**
     * Enter a parse tree produced by the `standardAssignment`
     * labeled alternative in `RustParser.assignment`.
     * @param ctx the parse tree
     */
    enterStandardAssignment?: (ctx: StandardAssignmentContext) => void;
    /**
     * Exit a parse tree produced by the `standardAssignment`
     * labeled alternative in `RustParser.assignment`.
     * @param ctx the parse tree
     */
    exitStandardAssignment?: (ctx: StandardAssignmentContext) => void;
    /**
     * Enter a parse tree produced by the `dereferenceAssignment`
     * labeled alternative in `RustParser.assignment`.
     * @param ctx the parse tree
     */
    enterDereferenceAssignment?: (ctx: DereferenceAssignmentContext) => void;
    /**
     * Exit a parse tree produced by the `dereferenceAssignment`
     * labeled alternative in `RustParser.assignment`.
     * @param ctx the parse tree
     */
    exitDereferenceAssignment?: (ctx: DereferenceAssignmentContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.expressionStatement`.
     * @param ctx the parse tree
     */
    enterExpressionStatement?: (ctx: ExpressionStatementContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.expressionStatement`.
     * @param ctx the parse tree
     */
    exitExpressionStatement?: (ctx: ExpressionStatementContext) => void;
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
     * Enter a parse tree produced by the `dereferenceExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterDereferenceExpr?: (ctx: DereferenceExprContext) => void;
    /**
     * Exit a parse tree produced by the `dereferenceExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitDereferenceExpr?: (ctx: DereferenceExprContext) => void;
    /**
     * Enter a parse tree produced by the `referenceExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterReferenceExpr?: (ctx: ReferenceExprContext) => void;
    /**
     * Exit a parse tree produced by the `referenceExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitReferenceExpr?: (ctx: ReferenceExprContext) => void;
    /**
     * Enter a parse tree produced by the `equalityOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterEqualityOp?: (ctx: EqualityOpContext) => void;
    /**
     * Exit a parse tree produced by the `equalityOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitEqualityOp?: (ctx: EqualityOpContext) => void;
    /**
     * Enter a parse tree produced by the `functionCall`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterFunctionCall?: (ctx: FunctionCallContext) => void;
    /**
     * Exit a parse tree produced by the `functionCall`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitFunctionCall?: (ctx: FunctionCallContext) => void;
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
     * Enter a parse tree produced by the `mulDivOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterMulDivOp?: (ctx: MulDivOpContext) => void;
    /**
     * Exit a parse tree produced by the `mulDivOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitMulDivOp?: (ctx: MulDivOpContext) => void;
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
     * Enter a parse tree produced by the `addSubOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    enterAddSubOp?: (ctx: AddSubOpContext) => void;
    /**
     * Exit a parse tree produced by the `addSubOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     */
    exitAddSubOp?: (ctx: AddSubOpContext) => void;
    /**
     * Enter a parse tree produced by `RustParser.argList`.
     * @param ctx the parse tree
     */
    enterArgList?: (ctx: ArgListContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.argList`.
     * @param ctx the parse tree
     */
    exitArgList?: (ctx: ArgListContext) => void;
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
    /**
     * Enter a parse tree produced by `RustParser.breakStatement`.
     * @param ctx the parse tree
     */
    enterBreakStatement?: (ctx: BreakStatementContext) => void;
    /**
     * Exit a parse tree produced by `RustParser.breakStatement`.
     * @param ctx the parse tree
     */
    exitBreakStatement?: (ctx: BreakStatementContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

