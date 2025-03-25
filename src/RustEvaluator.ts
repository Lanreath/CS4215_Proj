import * as rp from './parser/src/RustParser';
import { BasicEvaluator } from "conductor/dist/conductor/runner";
import { IRunnerPlugin } from "conductor/dist/conductor/runner/types";
import { CharStream, CommonTokenStream, AbstractParseTreeVisitor } from 'antlr4ng';
import { RustLexer } from './parser/src/RustLexer';
import { RustVisitor } from './parser/src/RustVisitor';
import { VirtualMachine } from './VirtualMachine';

// Enhanced borrow states
enum BorrowState {
    Owned,           // Variable is owned and can be used normally
    BorrowedMutably, // Variable has been mutably borrowed
    BorrowedImmutably, // Variable has been immutably borrowed
    Moved            // Variable's value has been moved and cannot be used
}

// Enhanced variable state tracking
class VariableState {
    state: BorrowState;
    mutable: boolean;
    value: number;
    borrowers: string[] = []; // Track which variables are borrowing this one
    
    constructor(mutable: boolean, value: number = 0) {
        this.state = BorrowState.Owned;
        this.mutable = mutable;
        this.value = value;
    }
}

// Custom errors for ownership and borrowing violations
class OwnershipError extends Error {
    constructor(message: string) {
        super(`Ownership error: ${message}`);
        this.name = "OwnershipError";
    }
}

class BorrowError extends Error {
    constructor(message: string) {
        super(`Borrow error: ${message}`);
        this.name = "BorrowError";
    }
}

export class RustEvaluatorVisitor extends AbstractParseTreeVisitor<number> implements RustVisitor<number> {
    private vm: VirtualMachine;
    private variableStates: Map<string, VariableState>;
    private variableAddresses: Map<string, number>;
    private referenceMap: Map<string, string>; // Maps reference names to their target
    private scopes: string[][]; // Stack of scopes for tracking variable lifetimes

    // Add constructor to accept a VM instance
    constructor(vm?: VirtualMachine) {
        super();
        this.vm = vm || new VirtualMachine();
        this.variableStates = new Map<string, VariableState>();
        this.variableAddresses = new Map<string, number>();
        this.referenceMap = new Map<string, string>();
        this.scopes = [[]];
    }

    // Scope management
    private currentScope(): string[] {
        return this.scopes[this.scopes.length - 1];
    }

    private enterScope(): void {
        this.scopes.push([]);
    }

    private exitScope(): void {
        const scope = this.scopes.pop();
        if (!scope) return;

        // Check for and clean up variables in this scope
        for (const name of scope) {
            const state = this.variableStates.get(name);
            
            if (state && state.borrowers.length > 0) {
                throw new BorrowError(`Variable ${name} still has active borrows at end of scope`);
            }
            
            // Clean up the variable
            this.variableStates.delete(name);
            this.variableAddresses.delete(name);
            
            // If this is a reference, release the borrow
            if (this.referenceMap.has(name)) {
                this.releaseBorrow(name);
            }
        }
    }

    // Variable declarations and lookup
    private declareVariable(name: string, mutable: boolean, value: number = 0): void {
        try {
            // Register in current scope
            this.currentScope().push(name);
            
            // Create variable state
            const state = new VariableState(mutable, value);
            this.variableStates.set(name, state);
            
            // Allocate memory in VM - handle this properly
            const address = this.vm.allocateVariable();
            this.variableAddresses.set(name, address);
            this.vm.storeValue(address, value);
        } catch (error) {
            console.error(`Error allocating variable ${name}: ${error}`);
            throw error; // Re-throw to propagate the error
        }
    }

    private lookupVariable(name: string): VariableState | undefined {
        return this.variableStates.get(name);
    }

    // Ownership management
    private moveVariable(sourceVar: string, destVar: string): void {
        const sourceState = this.lookupVariable(sourceVar);
        
        if (!sourceState) {
            throw new OwnershipError(`Cannot move from undefined variable: ${sourceVar}`);
        }
        
        if (sourceState.state === BorrowState.Moved) {
            throw new OwnershipError(`Cannot use ${sourceVar} after it has been moved`);
        }
        
        if (sourceState.borrowers.length > 0) {
            throw new BorrowError(`Cannot move ${sourceVar} while it is borrowed`);
        }
        
        // Mark source as moved
        sourceState.state = BorrowState.Moved;
    }

    // Borrowing management
    private borrowMutably(targetVar: string, borrowerVar: string): void {
        const targetState = this.lookupVariable(targetVar);
        
        if (!targetState) {
            throw new BorrowError(`Cannot borrow undefined variable: ${targetVar}`);
        }
        
        if (targetState.state === BorrowState.Moved) {
            throw new BorrowError(`Cannot borrow ${targetVar} after it has been moved`);
        }
        
        if (!targetState.mutable) {
            throw new BorrowError(`Cannot mutably borrow immutable variable ${targetVar}`);
        }
        
        if (targetState.borrowers.length > 0) {
            throw new BorrowError(`Cannot mutably borrow ${targetVar} as it is already borrowed`);
        }
        
        // Register the borrow
        targetState.borrowers.push(borrowerVar);
        targetState.state = BorrowState.BorrowedMutably;
        
        // Record the reference relationship
        this.referenceMap.set(borrowerVar, targetVar);
    }

    private borrowImmutably(targetVar: string, borrowerVar: string): void {
        const targetState = this.lookupVariable(targetVar);
        
        if (!targetState) {
            throw new BorrowError(`Cannot borrow undefined variable: ${targetVar}`);
        }
        
        if (targetState.state === BorrowState.Moved) {
            throw new BorrowError(`Cannot borrow ${targetVar} after it has been moved`);
        }
        
        if (targetState.state === BorrowState.BorrowedMutably) {
            throw new BorrowError(`Cannot immutably borrow ${targetVar} as it is already mutably borrowed`);
        }
        
        // Register the borrow
        targetState.borrowers.push(borrowerVar);
        
        // Only change to immutably borrowed if not already in that state
        if (targetState.state === BorrowState.Owned) {
            targetState.state = BorrowState.BorrowedImmutably;
        }
        
        // Record the reference relationship
        this.referenceMap.set(borrowerVar, targetVar);
    }

    private releaseBorrow(borrowerVar: string): void {
        const targetVar = this.referenceMap.get(borrowerVar);
        if (!targetVar) return;
        
        const targetState = this.lookupVariable(targetVar);
        if (!targetState) return;
        
        // Remove this borrower
        const index = targetState.borrowers.indexOf(borrowerVar);
        if (index !== -1) {
            targetState.borrowers.splice(index, 1);
            
            // Reset state if no more borrowers
            if (targetState.borrowers.length === 0) {
                targetState.state = BorrowState.Owned;
            }
        }
        
        // Remove the reference mapping
        this.referenceMap.delete(borrowerVar);
    }

    // Access checks
    private checkReadAccess(varName: string): void {
        const state = this.lookupVariable(varName);
        
        if (!state) {
            throw new OwnershipError(`Variable ${varName} not declared`);
        }
        
        if (state.state === BorrowState.Moved) {
            throw new OwnershipError(`Cannot use ${varName} after it has been moved`);
        }
        
        if (state.state === BorrowState.BorrowedMutably && !this.referenceMap.has(varName)) {
            throw new BorrowError(`Cannot read ${varName} while it is mutably borrowed`);
        }
    }

    private checkWriteAccess(varName: string): void {
        const state = this.lookupVariable(varName);
        
        if (!state) {
            throw new OwnershipError(`Variable ${varName} not declared`);
        }
        
        if (!state.mutable) {
            throw new OwnershipError(`Cannot assign to immutable variable ${varName}`);
        }
        
        if (state.state === BorrowState.Moved) {
            throw new OwnershipError(`Cannot assign to ${varName} after it has been moved`);
        }
        
        if (state.borrowers.length > 0) {
            throw new BorrowError(`Cannot assign to ${varName} while it is borrowed`);
        }
    }

    private isMutableReference(refName: string): boolean {
        const targetName = this.referenceMap.get(refName);
        if (!targetName) return false;
        
        const targetState = this.lookupVariable(targetName);
        if (!targetState) return false;
        
        return targetState.state === BorrowState.BorrowedMutably && 
               targetState.borrowers.includes(refName);
    }

    // Virtual machine interaction
    public runVM(): number {
        try {
            const result = this.vm.run();
            return result;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Runtime error: ${error.message}`);
            } else {
                console.error(`Unknown runtime error: ${String(error)}`);
            }
            return 0;
        }
    }

    // Visit methods for grammar

    // Visit a parse tree produced by RustParser#prog
    visitProg(ctx: rp.ProgContext): number {
        // Reset state for a new program
        this.variableStates.clear();
        this.variableAddresses.clear();
        this.referenceMap.clear();
        this.scopes = [[]];
        
        // Visit all statements
        for (const statement of ctx.statement()) {
            this.visit(statement);
        }
        
        // Mark end of program
        this.vm.pushInstruction("DONE");
        this.vm.printInstructions();
        
        return 0;
    }

    // Visit a parse tree produced by RustParser#variableDeclaration
    visitVariableDeclaration(ctx: rp.VariableDeclarationContext): number {
        if (!ctx._name || !ctx._value || !ctx._name.text) {
            throw new Error("Error in variable declaration grammar");
        }
        
        const name = ctx._name.text;
        const isMutable = ctx._mutFlag ? true : false;
        
        // Evaluate the expression to get the value
        const value = this.visit(ctx._value);
        
        // Declare the variable in current scope
        this.declareVariable(name, isMutable, value);
        
        // Handle ownership transfer if the value is a variable
        if (ctx._value instanceof rp.IdentifierContext) {
            const sourceVar = ctx._value.getText();
            
            // Only move if it's not a reference
            if (!this.referenceMap.has(sourceVar)) {
                this.moveVariable(sourceVar, name);
            }
        }
        
        return 0;
    }

    visitStandardAssignment(ctx: rp.StandardAssignmentContext): number {
        const varName = ctx.IDENTIFIER().getText();
        
        try {
            // Check if we can write to this variable
            this.checkWriteAccess(varName);
            
            // Evaluate the expression
            const value = this.visit(ctx.expression());
            
            // Handle ownership transfer if the value is a variable
            if (ctx.expression() instanceof rp.IdentifierContext) {
                const sourceVar = ctx.expression().getText();
                
                // Only move if it's not a reference
                if (!this.referenceMap.has(sourceVar)) {
                    this.moveVariable(sourceVar, varName);
                }
            }
            
            // Update the variable's value - safely
            const state = this.lookupVariable(varName);
            if (state) {
                state.value = value;
                
                // Update in VM memory
                const addr = this.variableAddresses.get(varName);
                if (addr !== undefined) {
                    this.vm.storeValue(addr, value);
                } else {
                    console.error(`Missing address for variable ${varName}`);
                }
            }
            
            return 0;
        } catch (error) {
            console.error(`Error in assignment to ${varName}: ${error}`);
            throw error; // Re-throw to propagate the error
        }
    }

    // Visit a parse tree produced by RustParser#referenceExpr
    visitReferenceExpr(ctx: rp.ReferenceExprContext): number {
        if (!ctx._target) {
            throw new Error("Error in reference expression grammar");
        }
        
        if (!(ctx._target instanceof rp.IdentifierContext)) {
            throw new BorrowError("Can only borrow variables directly");
        }
        
        const targetVar = ctx._target.getText();
        
        // Check if 'mut' is present in text
        const exprText = ctx.getText();
        const isMutable = exprText.includes('&mut ') || exprText.match(/&\s*mut\s+/);
        
        // Generate a synthetic name for the reference
        const refName = `ref_to_${targetVar}_${Date.now()}`;
        
        // Perform the borrow
        if (isMutable) {
            this.borrowMutably(targetVar, refName);
        } else {
            this.borrowImmutably(targetVar, refName);
        }
        
        // Create a variable to hold the reference
        const targetState = this.lookupVariable(targetVar);
        if (targetState) {
            this.declareVariable(refName, false, targetState.value); // References themselves are immutable
        }
        
        // References don't push values onto the stack
        return 0;
    }

    // Visit a parse tree produced by RustParser#dereferenceExpr
    visitDereferenceExpr(ctx: rp.DereferenceExprContext): number {
        if (!(ctx._target instanceof rp.IdentifierContext)) {
            throw new BorrowError("Can only dereference reference variables directly");
        }
        
        const refName = ctx._target.getText();
        const targetVar = this.referenceMap.get(refName);
        
        if (!targetVar) {
            throw new BorrowError(`${refName} is not a reference`);
        }
        
        // Get the target value
        const targetState = this.lookupVariable(targetVar);
        if (!targetState) {
            throw new BorrowError(`Target of reference ${refName} no longer exists`);
        }
        
        // Push the dereferenced value onto the stack
        this.vm.pushInstruction("LDCN", targetState.value);
        
        return targetState.value;
    }

    // Visit a parse tree produced by RustParser#dereferenceAssignment
    visitDereferenceAssignment(ctx: rp.DereferenceAssignmentContext): number {
        // Extract the reference name from *refName = value
        if (!(ctx._target instanceof rp.DereferenceExprContext) ||
            !(ctx._target._target instanceof rp.IdentifierContext)) {
            throw new BorrowError("Invalid dereference assignment syntax");
        }
        
        const refName = ctx._target._target.getText();
        const targetVar = this.referenceMap.get(refName);
        
        if (!targetVar) {
            throw new BorrowError(`${refName} is not a reference`);
        }
        
        // Check if this is a mutable reference
        if (!this.isMutableReference(refName)) {
            throw new BorrowError(`Cannot assign through immutable reference ${refName}`);
        }
        
        // Get the target
        const targetState = this.lookupVariable(targetVar);
        if (!targetState) {
            throw new BorrowError(`Target of reference ${refName} no longer exists`);
        }
        
        // Evaluate the value expression
        const value = this.visit(ctx._value);
        
        // Update the target value
        targetState.value = value;
        
        // Update in VM memory
        const addr = this.variableAddresses.get(targetVar);
        if (addr !== undefined) {
            this.vm.storeValue(addr, value);
        }
        
        return 0;
    }

    // Visit a parse tree produced by RustParser#block
    visitBlock(ctx: rp.BlockContext): number {
        // Create a new scope for the block
        this.enterScope();
        
        try {
            // Execute all statements in the block
            for (const statement of ctx.statement()) {
                this.visit(statement);
            }
            
            // Handle the optional final expression
            let result = 0;
            if (ctx.expression()) {
                result = this.visit(ctx.expression());
            }
            
            return result;
        } finally {
            // Always exit the scope, even if there's an error
            this.exitScope();
        }
    }

    // Visit a parse tree produced by RustParser#identifier
    visitIdentifier(ctx: rp.IdentifierContext): number {
        const varName = ctx.IDENTIFIER().getText();
        
        // Check if this variable can be read
        this.checkReadAccess(varName);
        
        // Get the value
        const state = this.lookupVariable(varName);
        if (!state) {
            throw new OwnershipError(`Variable ${varName} not declared`);
        }
        
        // Push value onto stack
        this.vm.pushInstruction("LDCN", state.value);
        
        return state.value;
    }

    // Override the default result method from AbstractParseTreeVisitor
    protected defaultResult(): number {
        return 0;
    }
    
    // Override the aggregate result method
    protected aggregateResult(aggregate: number, nextResult: number): number {
        return nextResult;
    }

    // Methods push values onto the VM stack
    visitInt(ctx: rp.IntContext): number {
        const value = parseInt(ctx.INT().getText());
        console.log(`Visiting integer: ${value}`);
        this.vm.pushInstruction("LDCN", value);
        return value;
    }

    visitParenExpr(ctx: rp.ParenExprContext): number {
        console.log(`Visiting parenthesized expression`);
        return this.visit(ctx.expression());
    }

    visitMulDivOp(ctx: rp.MulDivOpContext): number {
        console.log(`Visiting multiplication/division operation`);
        
        // Evaluate the left expression
        this.visit(ctx._left);
        
        // Then evaluate the right expression
        this.visit(ctx._right);
        
        const op = ctx._op.text;
        switch (op) {
            case "*": this.vm.pushInstruction("TIMES"); break;
            case "/": this.vm.pushInstruction("DIVIDE"); break;
            default: throw new Error(`Invalid multiplication/division operator: ${op}`);
        }
        
        // The VM will handle popping the operands and pushing the result
        return 0; // The actual result will be on the VM stack
    }

    visitAddSubOp(ctx: rp.AddSubOpContext): number {
        console.log(`Visiting addition/subtraction operation`);
        
        // First evaluate the left expression
        this.visit(ctx._left);
        
        // Then evaluate the right expression
        this.visit(ctx._right);
        
        // Now push the operation
        const op = ctx._op.text;
        switch (op) {
            case "+": this.vm.pushInstruction("PLUS"); break;
            case "-": this.vm.pushInstruction("MINUS"); break;
            default: throw new Error(`Invalid addition/subtraction operator: ${op}`);
        }
        
        return 0; // The actual result will be on the VM stack
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
            // Reset the visitor for each new chunk
            const vm = new VirtualMachine();
            this.visitor = new RustEvaluatorVisitor(vm);
            
            // Create the lexer and parser
            const inputStream = CharStream.fromString(chunk);
            const lexer = new RustLexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new rp.RustParser(tokenStream);
            
            // Parse the input
            const tree = parser.prog();
            
            // Evaluate the parsed tree
            this.visitor.visit(tree);
            
            // Run the VM to get the result
            const result = vm.run();
            
            // Send the result to the REPL
            this.conductor.sendOutput(`Output: ${result}`);
            
            // Don't print VM instructions here to avoid duplicate output
        } catch (error) {
            if (error instanceof Error) {
                this.conductor.sendOutput(`Error: ${error.message}`);
            } else {
                this.conductor.sendOutput(`Error: ${String(error)}`);
            }
        }
    }
}