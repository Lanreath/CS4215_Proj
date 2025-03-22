import * as rp from './parser/src/RustParser';
import { BasicEvaluator } from "conductor/dist/conductor/runner";
import { IRunnerPlugin } from "conductor/dist/conductor/runner/types";
import { CharStream, CommonTokenStream, AbstractParseTreeVisitor } from 'antlr4ng';
import { RustLexer } from './parser/src/RustLexer';
import { RustVisitor } from './parser/src/RustVisitor';

enum BorrowState {
    Owned,
    BorrowedMutably,
    BorrowedImmutably
}

class VariableState {
    constructor(public state: BorrowState, public value: number, public mutable: boolean) {}
}

class RustEvaluatorVisitor extends AbstractParseTreeVisitor<number> implements RustVisitor<number> {
    private variableStates: Map<string, VariableState> = new Map();

    // Visit a parse tree produced by RustParser#prog
    visitProg(ctx: rp.ProgContext): number {
        let result = 0;
        for (const statement of ctx.statement()) {
            result = this.visit(statement);
        }
        return result;
    }

    // Visit a parse tree produced by RustParser#variableDeclaration
    visitVariableDeclaration(ctx: rp.VariableDeclarationContext): number {
        const name = ctx._name.text;
        const value = this.visit(ctx._value);
        const isMutable = ctx._mutFlag ? true : false;
        this.variableStates.set(name, new VariableState(BorrowState.Owned, value, isMutable));
        return value;
    }

    // Visit a parse tree produced by RustParser#assignment
    visitAssignment(ctx: rp.AssignmentContext): number {
        const variable = ctx.IDENTIFIER().getText();
        const state = this.variableStates.get(variable);

        if (state && !state.mutable) {
            throw new Error(`Variable ${variable} is not mutable`);
        }

        // Check if the value is a variable and transfer ownership
        if (ctx.expression() instanceof rp.IdentifierContext) {
            const sourceVariable = ctx.expression().getText();
            const sourceState = this.variableStates.get(sourceVariable);
            if (!sourceState) {
                throw new Error(`Variable ${sourceVariable} not declared`);
            }
            if (sourceState.state !== BorrowState.Owned) {
                throw new Error(`Variable ${sourceVariable} is not owned and cannot be assigned`);
            }
            // Transfer ownership
            this.variableStates.set(sourceVariable, new VariableState(BorrowState.BorrowedMutably, sourceState.value, sourceState.mutable));
        } else {
            const value = this.visit(ctx.expression());
            this.variableStates.set(variable, new VariableState(BorrowState.Owned, value, state ? state.mutable : false));
        }
        const result = this.variableStates.get(variable)?.value
        if (result === undefined) {
            throw new Error(`Variable assignment failed`);
        }
        return result;
    }

    // Visit a parse tree produced by RustParser#parenExpr
    visitParenExpr(ctx: rp.ParenExprContext): number {
        return this.visit(ctx.expression());
    }

    // Visit a parse tree produced by RustParser#binaryOp
    visitBinaryOp(ctx: rp.BinaryOpContext): number {
        const left = this.visit(ctx._left);
        const right = this.visit(ctx._right);
        const op = ctx._op.text;

        // TODO: implement in virtual machine control and operand stacks
        switch (op) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/':
                if (right === 0) {
                    throw new Error("Division by zero");
                }
                return left / right;
            case '>':
                return left > right ? 1 : 0;
            case '<':
                return left < right ? 1 : 0;
            case '>=':
                return left >= right ? 1 : 0;
            case '<=':
                return left <= right ? 1 : 0;
            case '==':
                return left === right ? 1 : 0;
            case '!=':
                return left !== right ? 1 : 0;
            default:
                throw new Error(`Unknown operator: ${op}`);
        }
    }

    // Visit a parse tree produced by RustParser#unaryOp
    visitUnaryOp(ctx: rp.UnaryOpContext): number {
        // TODO: Implement in virtual machine control and operand stacks
        const value = this.visit(ctx._operand);
        return -value;
    }

    visitIdentifier(ctx: rp.IdentifierContext): number {
        // TODO: Implement in environment frames
        const value = this.variableStates.get(ctx.IDENTIFIER().getText())?.value;
        if (value === undefined) {
            throw new Error(`Variable ${ctx.IDENTIFIER().getText()} not declared`);
        }
        return value;
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

export class RustEvaluator extends BasicEvaluator {
    private executionCount: number;
    private visitor: RustEvaluatorVisitor;

    constructor(conductor: IRunnerPlugin) {
        super(conductor);
        this.executionCount = 0;
        this.visitor = new RustEvaluatorVisitor();
    }

    async evaluateChunk(chunk: string): Promise<void> {
        this.executionCount++;
        try {
            // Create the lexer and parser
            const inputStream = CharStream.fromString(chunk);
            const lexer = new RustLexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new rp.RustParser(tokenStream);
            
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