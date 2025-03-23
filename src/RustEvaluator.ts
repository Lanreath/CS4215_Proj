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


interface Runtime {
    address: number;
    os: any;
    env: any;
}

class VariableState {
    constructor(public state: BorrowState, public value: number, public mutable: boolean) {}
}

export class RustEvaluatorVisitor extends AbstractParseTreeVisitor<number> implements RustVisitor<number> {
    private mem: ArrayBuffer = new ArrayBuffer(1024); // Memory

    /**  TODO: Implement with single array buffer
    private pc: number = 0; // Program counter
    private os: number[] = []; // Operand stack
    private env: any[] = []; // Environment frames
    private rs: Runtime[] = []; // Runtime stack
    */

    private variableStates: Map<string, VariableState> = new Map();

    // Visit a parse tree produced by RustParser#prog
    visitProg(ctx: rp.ProgContext): number {
        let result : number = 0;
        for (const statement of ctx.statement()) {
            result = this.visit(statement) ?? 0;
        }
        if (result == null) {
            throw new Error("No result returned from program");
        }
        return result;
    }

    // Use this for debugging
    visitStatement(ctx: rp.StatementContext): number {
        const result = this.visitChildren(ctx);
        console.log(result);
        return result ?? 0;
    }

    // Visit a parse tree produced by RustParser#variableDeclaration
    visitVariableDeclaration(ctx: rp.VariableDeclarationContext): number {
        if (!ctx._name || !ctx._value || !ctx._name.text) {
            throw new Error("Error in variable declaration grammar"); 
        }
        const name = ctx._name.text;
        const value = this.visit(ctx._value) 
        if (value == null) {
            throw new Error("Missing value in variable declaration");
        }
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
                throw new Error(`Variable ${sourceVariable} not declared.`);
            }
            if (sourceState.state !== BorrowState.Owned) {
                throw new Error(`Variable ${sourceVariable} is not owned and cannot be assigned`);
            }
            // Transfer ownership
            this.variableStates.set(sourceVariable, new VariableState(BorrowState.BorrowedMutably, sourceState.value, sourceState.mutable));
        } else {
            const value = this.visit(ctx.expression());
            if (value == null) {
                throw new Error("Missing value in assignment");
            }
            this.variableStates.set(variable, new VariableState(BorrowState.Owned, value, state ? state.mutable : false));
        }
        const result = this.variableStates.get(variable)?.value
        if (result === undefined) {
            throw new Error(`Variable assignment failed`);
        }
        return result;
    }

    visitExpressionStatement(ctx: rp.ExpressionStatementContext): number {
        const result = this.visit(ctx.expression());
        if (result == null) {
            throw new Error("Missing value in expression statement");
        }
        return result;
    }

    // Visit a parse tree produced by RustParser#parenExpr
    visitParenExpr(ctx: rp.ParenExprContext): number {
        const result = this.visit(ctx.expression());
        if (result == null) {
            throw new Error("Missing value in parentheses");
        }
        return result;
    }

    // Visit a parse tree produced by RustParser#binaryOp
    visitBinaryOp(ctx: rp.BinaryOpContext): number {
        // TODO: implement in virtual machine control and operand stacks
        if (!ctx._left || !ctx._right || !ctx._op) {
            throw new Error("Error in binary operation grammar");
        }
        const left = this.visit(ctx._left);
        const right = this.visit(ctx._right);
        const op = ctx._op.text;
        if (left == null || right == null) {
            throw new Error("Missing value in binary operation");
        }

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
        if (!ctx._operand) {
            throw new Error("Error in unary operation grammar");
        }
        const value = this.visit(ctx._operand);
        if (value == null) {
            throw new Error("Missing value in unary operation");
        }
        return -value;
    }

    visitIdentifier(ctx: rp.IdentifierContext): number {
        // TODO: Implement in environment frames
        const value = this.variableStates.get(ctx.IDENTIFIER().getText())?.value;
        if (value === undefined) {
            throw new Error(`Variable ${ctx.IDENTIFIER().getText()} not declared.`);
        }
        return value;
    }

    visitInt(ctx: rp.IntContext): number {
        return parseInt(ctx.INT().getText());
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