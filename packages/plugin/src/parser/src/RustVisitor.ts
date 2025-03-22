// Generated from src/Rust.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


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
     * Visit a parse tree produced by `RustParser.replLine`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReplLine?: (ctx: ReplLineContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.statement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatement?: (ctx: StatementContext) => Result;
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
     * Visit a parse tree produced by `RustParser.elifBranch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElifBranch?: (ctx: ElifBranchContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.elseBranch`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElseBranch?: (ctx: ElseBranchContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.whileLoop`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWhileLoop?: (ctx: WhileLoopContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.assignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAssignment?: (ctx: AssignmentContext) => Result;
    /**
     * Visit a parse tree produced by the `identifier`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIdentifier?: (ctx: IdentifierContext) => Result;
    /**
     * Visit a parse tree produced by the `binaryOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBinaryOp?: (ctx: BinaryOpContext) => Result;
    /**
     * Visit a parse tree produced by the `unaryOp`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUnaryOp?: (ctx: UnaryOpContext) => Result;
    /**
     * Visit a parse tree produced by the `parenExpr`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParenExpr?: (ctx: ParenExprContext) => Result;
    /**
     * Visit a parse tree produced by the `int`
     * labeled alternative in `RustParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInt?: (ctx: IntContext) => Result;
    /**
     * Visit a parse tree produced by `RustParser.type`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitType?: (ctx: TypeContext) => Result;
}

