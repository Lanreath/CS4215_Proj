import { BasicEvaluator } from "conductor/dist/conductor/runner";
import { IRunnerPlugin } from "conductor/dist/conductor/runner/types";
import { CharStream, CommonTokenStream, AbstractParseTreeVisitor } from 'antlr4ng';
import { SimpleLangLexer } from './parser/SimpleLangLexer';
import { SimpleLangParser, ExpressionContext, ProgContext, VariableDeclarationContext, AssignmentContext, DisplayStatementContext } from './parser/SimpleLangParser';
import { SimpleLangVisitor } from './parser/SimpleLangVisitor';

enum BorrowState {
    Owned,
    BorrowedMutably,
    BorrowedImmutably
}

class VariableState {
    constructor(public state: BorrowState, public value: number, public mutable: boolean) {}
}

class SimpleLangEvaluatorVisitor extends AbstractParseTreeVisitor<number> implements SimpleLangVisitor<number> {
    private variableStates: Map<string, VariableState> = new Map();

    // Visit a parse tree produced by SimpleLangParser#prog
    visitProg(ctx: ProgContext): number {
        let result = 0;
        for (const statement of ctx.statement()) {
            result = this.visit(statement);
        }
        return result;
    }

    // Visit a parse tree produced by SimpleLangParser#variableDeclaration
    visitVariableDeclaration(ctx: VariableDeclarationContext): number {
        const variable = ctx.IDENTIFIER().getText();
        const value = this.visit(ctx.expression());
        const mutable = ctx.getChild(1)?.getText() === 'mut';
        this.variableStates.set(variable, new VariableState(BorrowState.Owned, value, mutable));
        return value;
    }

    // Visit a parse tree produced by SimpleLangParser#assignment
    visitAssignment(ctx: AssignmentContext): number {
        const variable = ctx.IDENTIFIER().getText();
        const value = this.visit(ctx.expression());

        // Check if the value is a variable and transfer ownership
        if (ctx.expression().IDENTIFIER()) {
            const sourceVariable = ctx.expression().IDENTIFIER().getText();
            const sourceState = this.variableStates.get(sourceVariable);
            if (!sourceState) {
                throw new Error(`Variable ${sourceVariable} not declared`);
            }
            if (sourceState.state !== BorrowState.Owned) {
                throw new Error(`Variable ${sourceVariable} is not owned and cannot be assigned`);
            }
            // Transfer ownership
            this.variableStates.set(sourceVariable, new VariableState(BorrowState.BorrowedMutably, sourceState.value, sourceState.mutable));
        }

        const state = this.variableStates.get(variable);
        if (state && !state.mutable) {
            throw new Error(`Variable ${variable} is not mutable`);
        }
        this.variableStates.set(variable, new VariableState(BorrowState.Owned, value, state ? state.mutable : false));
        return value;
    }

    // Visit a parse tree produced by SimpleLangParser#displayStatement
    visitDisplayStatement(ctx: DisplayStatementContext): number {
        const variable = ctx.IDENTIFIER().getText();
        const state = this.variableStates.get(variable);
        if (!state) {
            throw new Error(`Variable ${variable} not declared`);
        }
        if (state.state !== BorrowState.Owned) {
            throw new Error(`Variable ${variable} is not owned and cannot be displayed`);
        }
        console.log(state.value);
        return state.value;
    }

    // Visit a parse tree produced by SimpleLangParser#expression
    visitExpression(ctx: ExpressionContext): number {
        if (ctx.getChildCount() === 1) {
            if (ctx.INT()) {
                // INT case
                return parseInt(ctx.INT().getText());
            } else if (ctx.IDENTIFIER()) {
                // Variable case
                const variable = ctx.IDENTIFIER().getText();
                const state = this.variableStates.get(variable);
                if (!state) {
                    throw new Error(`Variable ${variable} not declared`);
                }
                if (state.state !== BorrowState.Owned) {
                    throw new Error(`Variable ${variable} is not owned and cannot be used`);
                }
                // Transfer ownership
                this.variableStates.set(variable, new VariableState(BorrowState.BorrowedMutably, state.value, state.mutable));
                return state.value;
            }
        } else if (ctx.getChildCount() === 3 && ctx.getChild(0).getText() === '&') {
            // Borrowing case
            const mutable = ctx.getChild(1).getText() === 'mut';
            const variable = ctx.getChild(mutable ? 2 : 1).getText();
            const state = this.variableStates.get(variable);
            if (!state) {
                throw new Error(`Variable ${variable} not declared`);
            }
            if (state.state !== BorrowState.Owned) {
                throw new Error(`Variable ${variable} is not owned and cannot be borrowed`);
            }
            this.borrowVariable(variable, mutable);
            return state.value;
        } else if (ctx.getChildCount() === 3) {
            if (ctx.getChild(0).getText() === '(' && ctx.getChild(2).getText() === ')') {
                // Parenthesized expression
                return this.visit(ctx.getChild(1) as ExpressionContext);
            } else {
                // Binary operation
                const left = this.visit(ctx.getChild(0) as ExpressionContext);
                const op = ctx.getChild(1).getText();
                const right = this.visit(ctx.getChild(2) as ExpressionContext);

                switch (op) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/':
                        if (right === 0) {
                            throw new Error("Division by zero");
                        }
                        return left / right;
                    default:
                        throw new Error(`Unknown operator: ${op}`);
                }
            }
        }
        
        throw new Error(`Invalid expression: ${ctx.getText()}`);
    }

    // Override the default result method from AbstractParseTreeVisitor
    protected defaultResult(): number {
        return 0;
    }
    
    // Override the aggregate result method
    protected aggregateResult(aggregate: number, nextResult: number): number {
        return nextResult;
    }

    // Additional methods to handle ownership and borrowing
    private checkBorrowingRules(variable: string, newState: BorrowState): void {
        const currentState = this.variableStates.get(variable)?.state;
        if (currentState === BorrowState.BorrowedMutably && newState !== BorrowState.Owned) {
            throw new Error(`Variable ${variable} is already mutably borrowed`);
        }
        if (currentState === BorrowState.BorrowedImmutably && newState === BorrowState.BorrowedMutably) {
            throw new Error(`Variable ${variable} is already immutably borrowed`);
        }
    }

    private borrowVariable(variable: string, mutable: boolean): void {
        const newState = mutable ? BorrowState.BorrowedMutably : BorrowState.BorrowedImmutably;
        this.checkBorrowingRules(variable, newState);
        this.variableStates.set(variable, new VariableState(newState, this.variableStates.get(variable)?.value ?? 0, this.variableStates.get(variable)?.mutable ?? false));
    }
    
    private returnVariable(variable: string): void {
        this.variableStates.set(variable, new VariableState(BorrowState.Owned, this.variableStates.get(variable)?.value ?? 0, this.variableStates.get(variable)?.mutable ?? false));
    }
}

export class SimpleLangEvaluator extends BasicEvaluator {
    private executionCount: number;
    private visitor: SimpleLangEvaluatorVisitor;

    constructor(conductor: IRunnerPlugin) {
        super(conductor);
        this.executionCount = 0;
        this.visitor = new SimpleLangEvaluatorVisitor();
    }

    async evaluateChunk(chunk: string): Promise<void> {
        this.executionCount++;
        try {
            // Create the lexer and parser
            const inputStream = CharStream.fromString(chunk);
            const lexer = new SimpleLangLexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new SimpleLangParser(tokenStream);
            
            // Parse the input
            const tree = parser.prog();
            
            // Evaluate the parsed tree
            const result = this.visitor.visit(tree);
            
            // Send the result to the REPL
            this.conductor.sendOutput(`Output: ${result}`);
        }  catch (error) {
            // Handle errors and send them to the REPL
            if (error instanceof Error) {
                this.conductor.sendOutput(`Error: ${error.message}`);
            } else {
                this.conductor.sendOutput(`Error: ${String(error)}`);
            }
        }
    }
}