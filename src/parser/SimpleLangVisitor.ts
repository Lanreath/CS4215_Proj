// Generated from src/SimpleLang.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { ProgContext } from "./SimpleLangParser.js";
import { StatementContext } from "./SimpleLangParser.js";
import { VariableDeclarationContext } from "./SimpleLangParser.js";
import { AssignmentContext } from "./SimpleLangParser.js";
import { DisplayStatementContext } from "./SimpleLangParser.js";
import { ExpressionStatementContext } from "./SimpleLangParser.js";
import { ExpressionContext } from "./SimpleLangParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `SimpleLangParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class SimpleLangVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `SimpleLangParser.prog`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProg?: (ctx: ProgContext) => Result;
    /**
     * Visit a parse tree produced by `SimpleLangParser.statement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatement?: (ctx: StatementContext) => Result;
    /**
     * Visit a parse tree produced by `SimpleLangParser.variableDeclaration`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableDeclaration?: (ctx: VariableDeclarationContext) => Result;
    /**
     * Visit a parse tree produced by `SimpleLangParser.assignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAssignment?: (ctx: AssignmentContext) => Result;
    /**
     * Visit a parse tree produced by `SimpleLangParser.displayStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDisplayStatement?: (ctx: DisplayStatementContext) => Result;
    /**
     * Visit a parse tree produced by `SimpleLangParser.expressionStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpressionStatement?: (ctx: ExpressionStatementContext) => Result;
    /**
     * Visit a parse tree produced by `SimpleLangParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpression?: (ctx: ExpressionContext) => Result;
}

