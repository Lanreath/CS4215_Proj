// Generated from /Users/fei/CS/CS4215/CS4215_Proj/src/Rust.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link RustParser}.
 */
public interface RustListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link RustParser#prog}.
	 * @param ctx the parse tree
	 */
	void enterProg(RustParser.ProgContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#prog}.
	 * @param ctx the parse tree
	 */
	void exitProg(RustParser.ProgContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#statement}.
	 * @param ctx the parse tree
	 */
	void enterStatement(RustParser.StatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#statement}.
	 * @param ctx the parse tree
	 */
	void exitStatement(RustParser.StatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#returnStatement}.
	 * @param ctx the parse tree
	 */
	void enterReturnStatement(RustParser.ReturnStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#returnStatement}.
	 * @param ctx the parse tree
	 */
	void exitReturnStatement(RustParser.ReturnStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#variableDeclaration}.
	 * @param ctx the parse tree
	 */
	void enterVariableDeclaration(RustParser.VariableDeclarationContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#variableDeclaration}.
	 * @param ctx the parse tree
	 */
	void exitVariableDeclaration(RustParser.VariableDeclarationContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#functionDeclaration}.
	 * @param ctx the parse tree
	 */
	void enterFunctionDeclaration(RustParser.FunctionDeclarationContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#functionDeclaration}.
	 * @param ctx the parse tree
	 */
	void exitFunctionDeclaration(RustParser.FunctionDeclarationContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#paramList}.
	 * @param ctx the parse tree
	 */
	void enterParamList(RustParser.ParamListContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#paramList}.
	 * @param ctx the parse tree
	 */
	void exitParamList(RustParser.ParamListContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#param}.
	 * @param ctx the parse tree
	 */
	void enterParam(RustParser.ParamContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#param}.
	 * @param ctx the parse tree
	 */
	void exitParam(RustParser.ParamContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#block}.
	 * @param ctx the parse tree
	 */
	void enterBlock(RustParser.BlockContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#block}.
	 * @param ctx the parse tree
	 */
	void exitBlock(RustParser.BlockContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#ifStatement}.
	 * @param ctx the parse tree
	 */
	void enterIfStatement(RustParser.IfStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#ifStatement}.
	 * @param ctx the parse tree
	 */
	void exitIfStatement(RustParser.IfStatementContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#elseBranch}.
	 * @param ctx the parse tree
	 */
	void enterElseBranch(RustParser.ElseBranchContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#elseBranch}.
	 * @param ctx the parse tree
	 */
	void exitElseBranch(RustParser.ElseBranchContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#whileStatement}.
	 * @param ctx the parse tree
	 */
	void enterWhileStatement(RustParser.WhileStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#whileStatement}.
	 * @param ctx the parse tree
	 */
	void exitWhileStatement(RustParser.WhileStatementContext ctx);
	/**
	 * Enter a parse tree produced by the {@code standardAssignment}
	 * labeled alternative in {@link RustParser#assignment}.
	 * @param ctx the parse tree
	 */
	void enterStandardAssignment(RustParser.StandardAssignmentContext ctx);
	/**
	 * Exit a parse tree produced by the {@code standardAssignment}
	 * labeled alternative in {@link RustParser#assignment}.
	 * @param ctx the parse tree
	 */
	void exitStandardAssignment(RustParser.StandardAssignmentContext ctx);
	/**
	 * Enter a parse tree produced by the {@code dereferenceAssignment}
	 * labeled alternative in {@link RustParser#assignment}.
	 * @param ctx the parse tree
	 */
	void enterDereferenceAssignment(RustParser.DereferenceAssignmentContext ctx);
	/**
	 * Exit a parse tree produced by the {@code dereferenceAssignment}
	 * labeled alternative in {@link RustParser#assignment}.
	 * @param ctx the parse tree
	 */
	void exitDereferenceAssignment(RustParser.DereferenceAssignmentContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#expressionStatement}.
	 * @param ctx the parse tree
	 */
	void enterExpressionStatement(RustParser.ExpressionStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#expressionStatement}.
	 * @param ctx the parse tree
	 */
	void exitExpressionStatement(RustParser.ExpressionStatementContext ctx);
	/**
	 * Enter a parse tree produced by the {@code identifier}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterIdentifier(RustParser.IdentifierContext ctx);
	/**
	 * Exit a parse tree produced by the {@code identifier}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitIdentifier(RustParser.IdentifierContext ctx);
	/**
	 * Enter a parse tree produced by the {@code bool}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterBool(RustParser.BoolContext ctx);
	/**
	 * Exit a parse tree produced by the {@code bool}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitBool(RustParser.BoolContext ctx);
	/**
	 * Enter a parse tree produced by the {@code dereferenceExpr}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterDereferenceExpr(RustParser.DereferenceExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code dereferenceExpr}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitDereferenceExpr(RustParser.DereferenceExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code referenceExpr}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterReferenceExpr(RustParser.ReferenceExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code referenceExpr}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitReferenceExpr(RustParser.ReferenceExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code equalityOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterEqualityOp(RustParser.EqualityOpContext ctx);
	/**
	 * Exit a parse tree produced by the {@code equalityOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitEqualityOp(RustParser.EqualityOpContext ctx);
	/**
	 * Enter a parse tree produced by the {@code unaryOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterUnaryOp(RustParser.UnaryOpContext ctx);
	/**
	 * Exit a parse tree produced by the {@code unaryOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitUnaryOp(RustParser.UnaryOpContext ctx);
	/**
	 * Enter a parse tree produced by the {@code int}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterInt(RustParser.IntContext ctx);
	/**
	 * Exit a parse tree produced by the {@code int}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitInt(RustParser.IntContext ctx);
	/**
	 * Enter a parse tree produced by the {@code parenExpr}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterParenExpr(RustParser.ParenExprContext ctx);
	/**
	 * Exit a parse tree produced by the {@code parenExpr}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitParenExpr(RustParser.ParenExprContext ctx);
	/**
	 * Enter a parse tree produced by the {@code addSubOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterAddSubOp(RustParser.AddSubOpContext ctx);
	/**
	 * Exit a parse tree produced by the {@code addSubOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitAddSubOp(RustParser.AddSubOpContext ctx);
	/**
	 * Enter a parse tree produced by the {@code logicalAndOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterLogicalAndOp(RustParser.LogicalAndOpContext ctx);
	/**
	 * Exit a parse tree produced by the {@code logicalAndOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitLogicalAndOp(RustParser.LogicalAndOpContext ctx);
	/**
	 * Enter a parse tree produced by the {@code logicalOrOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterLogicalOrOp(RustParser.LogicalOrOpContext ctx);
	/**
	 * Exit a parse tree produced by the {@code logicalOrOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitLogicalOrOp(RustParser.LogicalOrOpContext ctx);
	/**
	 * Enter a parse tree produced by the {@code functionCall}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterFunctionCall(RustParser.FunctionCallContext ctx);
	/**
	 * Exit a parse tree produced by the {@code functionCall}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitFunctionCall(RustParser.FunctionCallContext ctx);
	/**
	 * Enter a parse tree produced by the {@code mulDivOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterMulDivOp(RustParser.MulDivOpContext ctx);
	/**
	 * Exit a parse tree produced by the {@code mulDivOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitMulDivOp(RustParser.MulDivOpContext ctx);
	/**
	 * Enter a parse tree produced by the {@code logicalNotOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void enterLogicalNotOp(RustParser.LogicalNotOpContext ctx);
	/**
	 * Exit a parse tree produced by the {@code logicalNotOp}
	 * labeled alternative in {@link RustParser#expression}.
	 * @param ctx the parse tree
	 */
	void exitLogicalNotOp(RustParser.LogicalNotOpContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#argList}.
	 * @param ctx the parse tree
	 */
	void enterArgList(RustParser.ArgListContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#argList}.
	 * @param ctx the parse tree
	 */
	void exitArgList(RustParser.ArgListContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#type}.
	 * @param ctx the parse tree
	 */
	void enterType(RustParser.TypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#type}.
	 * @param ctx the parse tree
	 */
	void exitType(RustParser.TypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link RustParser#breakStatement}.
	 * @param ctx the parse tree
	 */
	void enterBreakStatement(RustParser.BreakStatementContext ctx);
	/**
	 * Exit a parse tree produced by {@link RustParser#breakStatement}.
	 * @param ctx the parse tree
	 */
	void exitBreakStatement(RustParser.BreakStatementContext ctx);
}