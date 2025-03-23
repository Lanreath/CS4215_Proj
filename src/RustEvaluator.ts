import * as rp from './parser/src/RustParser';
import { BasicEvaluator } from "conductor/dist/conductor/runner";
import { IRunnerPlugin } from "conductor/dist/conductor/runner/types";
import { CharStream, CommonTokenStream, AbstractParseTreeVisitor } from 'antlr4ng';
import { RustLexer } from './parser/src/RustLexer';
import { RustVisitor } from './parser/src/RustVisitor';
import { VirtualMachine } from './VirtualMachine';

export class RustEvaluatorVisitor extends AbstractParseTreeVisitor<number> implements RustVisitor<number> {
    private vm: VirtualMachine = new VirtualMachine();

    // Visit a parse tree produced by RustParser#prog
    visitProg(ctx: rp.ProgContext): number {
        for (const statement of ctx.statement()) {
            this.visit(statement);
        }
        this.vm.pushInstruction("DONE");
        this.vm.printInstructions();
        return 0;
    }

    // Visit a parse tree produced by RustParser#variableDeclaration
    visitVariableDeclaration(ctx: rp.VariableDeclarationContext): number {
        if (!ctx._name || !ctx._value || !ctx._name.text) {
            throw new Error("Error in variable declaration grammar"); 
        }
        this.visit(ctx._value) 
        return 0;
    }

    // Visit a parse tree produced by RustParser#functionDeclaration
    visitFunctionDeclaration(ctx: rp.FunctionDeclarationContext): number {
        // TODO: Implement in environment frames
        return 0;
    }

    // Visit a parse tree produced by RustParser#ifStatement
    visitIfStatement(ctx: rp.IfStatementContext): number {
        // TODO: Implement in environment frames
        if (!ctx._condition || !ctx._thenBlock) {
            throw new Error("Error in if statement grammar");
        }
        this.visit(ctx._condition);
        const jumpIndex = this.vm.pushInstruction("JOF", -1) - 1; // Jump to else branch if condition is false
        this.visit(ctx._thenBlock);
        const gotoIndex = this.vm.pushInstruction("GOTO", -1) - 1; // Jump to end of if statement
        this.vm.setInstructionTarget(jumpIndex, this.vm.getInstructionCounter());
        if (ctx.elseBranch()) {
            this.visit(ctx.elseBranch());
        }
        this.vm.setInstructionTarget(gotoIndex, this.vm.getInstructionCounter());
        return 0;
    }

    // Visit a parse tree produced by RustParser#whileStatement
    visitWhileStatement(ctx: rp.WhileStatementContext): number {
        // TODO: Implement in environment frames
        return 0;
    }

    // Visit a parse tree produced by RustParser#assignment
    visitAssignment(ctx: rp.AssignmentContext): number {
        // TODO: Implement in environment frames
        return 0;
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

    // Visit a parse tree produced by RustParser#equalityOp
    visitEqualityOp(ctx: rp.EqualityOpContext): number {
        console.log("Equality operation");
        if (!ctx._left || !ctx._right || !ctx._op) {
            throw new Error("Error in equality operation grammar");
        }
        this.visit(ctx._left);
        this.visit(ctx._right);

        const op = ctx._op.text;
        switch (op) {
            case "<":
                this.vm.pushInstruction("LT");
                break;
            case "<=":
                this.vm.pushInstruction("LE");
                break;
            case ">":
                this.vm.pushInstruction("GT");
                break;
            case ">=":
                this.vm.pushInstruction("GE");
                break;
            case "==":
                this.vm.pushInstruction("EQ");
                break;
            case "!=":
                this.vm.pushInstruction("NE");
                break;
            default:
                throw new Error(`Invalid equality operator ${op}`);
        }
        return 0;
    }

    // Visit a parse tree produced by RustParser#mulDivOp
    visitMulDivOp(ctx: rp.MulDivOpContext): number {
        if (!ctx._left || !ctx._right || !ctx._op) {
            throw new Error("Error in multiplication/division operation grammar");
        }
        this.visit(ctx._left);
        this.visit(ctx._right);

        const op = ctx._op.text;
        switch (op) {
            case "*":
                this.vm.pushInstruction("TIMES");
                break;
            case "/":
                this.vm.pushInstruction("DIVIDE");
                break;
            default:
                throw new Error(`Invalid multiplication/division operator ${op}`);
        }
        return 0;
    }

    // Visit a parse tree produced by RustParser#addSubOp
    visitAddSubOp(ctx: rp.AddSubOpContext): number {
        console.log("Addition/subtraction operation");
        if (!ctx._left || !ctx._right || !ctx._op) {
            throw new Error("Error in addition/subtraction operation grammar");
        }
        this.visit(ctx._left);
        this.visit(ctx._right);

        const op = ctx._op.text;
        switch (op) {
            case "+":
                this.vm.pushInstruction("PLUS");
                break;
            case "-":
                this.vm.pushInstruction("MINUS");
                break;
            default:
                throw new Error(`Invalid addition/subtraction operator ${op}`);
        }
        return 0;
    }


    // Visit a parse tree produced by RustParser#unaryOp
    visitUnaryOp(ctx: rp.UnaryOpContext): number {
        // TODO: Implement in virtual machine control and operand stacks
        if (!ctx._operand) {
            throw new Error("Error in unary operation grammar");
        }
        const value = this.visit(ctx._operand);
        // Negate the value by multiplying by -1
        this.vm.pushInstruction("LDCN", -1);
        this.vm.pushInstruction("TIMES");
        return -value;
    }

    visitIdentifier(ctx: rp.IdentifierContext): number {
        // TODO: Implement in environment frames
        return 0;
    }

    visitInt(ctx: rp.IntContext): number {
        const value = parseInt(ctx.INT().getText());
        this.vm.pushInstruction("LDCN", value);
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

    // Run the virtual machine
    public runVM(): number {
        const result = this.vm.run();
        return result;
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
            
            // Compile and evaluate the program
            this.visitor.visit(tree);
            
            // Run the program
            const result = this.visitor.runVM();
            
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