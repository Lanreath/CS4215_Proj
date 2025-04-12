// Generated from src/Rust.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


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
import { BoolContext } from "./RustParser.js";
import { DereferenceExprContext } from "./RustParser.js";
import { ReferenceExprContext } from "./RustParser.js";
import { EqualityOpContext } from "./RustParser.js";
import { UnaryOpContext } from "./RustParser.js";
import { IntContext } from "./RustParser.js";
import { ParenExprContext } from "./RustParser.js";
import { AddSubOpContext } from "./RustParser.js";
import { LogicalAndOpContext } from "./RustParser.js";
import { LogicalOrOpContext } from "./RustParser.js";
import { FunctionCallContext } from "./RustParser.js";
import { MulDivOpContext } from "./RustParser.js";
import { LogicalNotOpContext } from "./RustParser.js";
import { ArgListContext } from "./RustParser.js";
import { TypeContext } from "./RustParser.js";
import { ReferenceTypeContext } from "./RustParser.js";
import { AtomicTypeContext } from "./RustParser.js";
import { BreakStatementContext } from "./RustParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `RustParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class RustVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `RustParser.prog`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProg?: (ctx: ProgContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.statement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatement?: (ctx: StatementContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.returnStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReturnStatement?: (ctx: ReturnStatementContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.variableDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableDeclaration?: (ctx: VariableDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.functionDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.paramList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParamList?: (ctx: ParamListContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.param`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParam?: (ctx: ParamContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.block`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBlock?: (ctx: BlockContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.ifStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfStatement?: (ctx: IfStatementContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.elseBranch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElseBranch?: (ctx: ElseBranchContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.whileStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWhileStatement?: (ctx: WhileStatementContext) => Result;
    /**
     * Visit a parse tree produced by the `standardAssignment`
     * labeled alternative in `RustParser.assignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStandardAssignment?: (ctx: StandardAssignmentContext) => Result;
    /**
     * Visit a parse tree produced by the `dereferenceAssignment`
     * labeled alternative in `RustParser.assignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDereferenceAssignment?: (ctx: DereferenceAssignmentContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.expressionStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpressionStatement?: (ctx: ExpressionStatementContext) => Result;
    /**
     * Visit a parse tree produced by the `identifier`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIdentifier?: (ctx: IdentifierContext) => Result;
    /**
     * Visit a parse tree produced by the `bool`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBool?: (ctx: BoolContext) => Result;
    /**
     * Visit a parse tree produced by the `dereferenceExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDereferenceExpr?: (ctx: DereferenceExprContext) => Result;
    /**
     * Visit a parse tree produced by the `referenceExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReferenceExpr?: (ctx: ReferenceExprContext) => Result;
    /**
     * Visit a parse tree produced by the `equalityOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEqualityOp?: (ctx: EqualityOpContext) => Result;
    /**
     * Visit a parse tree produced by the `unaryOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUnaryOp?: (ctx: UnaryOpContext) => Result;
    /**
     * Visit a parse tree produced by the `int`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInt?: (ctx: IntContext) => Result;
    /**
     * Visit a parse tree produced by the `parenExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParenExpr?: (ctx: ParenExprContext) => Result;
    /**
     * Visit a parse tree produced by the `addSubOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAddSubOp?: (ctx: AddSubOpContext) => Result;
    /**
     * Visit a parse tree produced by the `logicalAndOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicalAndOp?: (ctx: LogicalAndOpContext) => Result;
    /**
     * Visit a parse tree produced by the `logicalOrOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicalOrOp?: (ctx: LogicalOrOpContext) => Result;
    /**
     * Visit a parse tree produced by the `functionCall`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionCall?: (ctx: FunctionCallContext) => Result;
    /**
     * Visit a parse tree produced by the `mulDivOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMulDivOp?: (ctx: MulDivOpContext) => Result;
    /**
     * Visit a parse tree produced by the `logicalNotOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicalNotOp?: (ctx: LogicalNotOpContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.argList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArgList?: (ctx: ArgListContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.type`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitType?: (ctx: TypeContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.referenceType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReferenceType?: (ctx: ReferenceTypeContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.atomicType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAtomicType?: (ctx: AtomicTypeContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.breakStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBreakStatement?: (ctx: BreakStatementContext) => Result;
}

