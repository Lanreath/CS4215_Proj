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
    private lastCreatedReference: string | undefined; // Store the last created reference
    private functionReturnValue: number | null = null;
    private isReturning: boolean = false;
    private currentFunctionReturnType: string | null = null;

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
        
        // Process each variable in the scope
        for (const name of scope) {
            const state = this.variableStates.get(name);
            
            if (state) {
                // Release any borrows held by this variable
                if (this.referenceMap.has(name)) {
                    const targetVar = this.referenceMap.get(name);
                    if (targetVar) {
                        const targetState = this.variableStates.get(targetVar);
                        if (targetState) {
                            // Remove this reference from the borrowers list
                            targetState.borrowers = targetState.borrowers.filter(b => b !== name);
                            
                            // If no more borrowers, update the state
                            if (targetState.borrowers.length === 0) {
                                if (targetState.state === BorrowState.BorrowedImmutably) {
                                    targetState.state = BorrowState.Owned;
                                } else if (targetState.state === BorrowState.BorrowedMutably) {
                                    targetState.state = BorrowState.Owned;
                                }
                            }
                        }
                    }
                    
                    // Remove the reference mapping
                    this.referenceMap.delete(name);
                }
                
                // Clean up variable state
                this.variableStates.delete(name);
            }
            
            // Clean up memory address
            this.variableAddresses.delete(name);
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

    // Enhance your borrowImmutably method
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

    // Add a method to check if a variable is a reference
    private isReference(varName: string): boolean {
        return this.referenceMap.has(varName);
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
        
        console.log(`Declaring variable: ${name}, mutable: ${isMutable}`);
        
        // Check if this is a reference type
        const isRefType = ctx.type && ctx.type().getText().includes('&');
        
        // Check if this is a reference expression
        const isRefExpr = ctx._value instanceof rp.ReferenceExprContext;
        
        if (isRefExpr && isRefType) {
            // First visit the expression to create the reference
            this.visit(ctx._value);
            
            const refName = this.lastCreatedReference;
            if (!refName) {
                throw new BorrowError(`Failed to create reference for ${name}`);
            }
            
            // Copy the reference mapping to the new variable name
            const targetVar = this.referenceMap.get(refName);
            if (targetVar) {
                console.log(`Creating reference alias: ${name} -> ${targetVar}`);
                
                // Register the new reference name in the current scope
                this.currentScope().push(name);
                
                // Add it to the reference map
                this.referenceMap.set(name, targetVar);
                
                // Get the target's state
                const targetState = this.lookupVariable(targetVar);
                if (targetState) {
                    // Update borrowers list
                    targetState.borrowers.push(name);
                    
                    // Create a state for the new reference variable
                    const refState = new VariableState(false, targetState.value);
                    this.variableStates.set(name, refState);
                    
                    // Allocate memory in VM
                    const address = this.vm.allocateVariable();
                    this.variableAddresses.set(name, address);
                    this.vm.storeValue(address, targetState.value);
                }
                
                // Clear the lastCreatedReference after use
                this.lastCreatedReference = null;
            } else {
                throw new BorrowError(`Invalid reference creation`);
            }
        } else {
            // Normal variable declaration with a value
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
        }
        
        return 0;
    }

    // Visit a parse tree produced by RustParser#standardAssignment
    visitStandardAssignment(ctx: rp.StandardAssignmentContext): number {
        const target = ctx.IDENTIFIER().getText();
        console.log(`Assignment to ${target}`);
        
        // Check if the variable exists and is mutable
        const targetState = this.lookupVariable(target);
        if (!targetState) {
            throw new Error(`Cannot assign to undefined variable: ${target}`);
        }
        
        this.checkWriteAccess(target);
        
        // Check if the variable is currently borrowed
        if (targetState.state === BorrowState.BorrowedImmutably) {
            throw new Error(`Cannot assign to ${target} while it is borrowed`);
        }
        
        if (targetState.state === BorrowState.BorrowedMutably) {
            throw new Error(`Cannot assign to ${target} while it is mutably borrowed`);
        }
        
        // Evaluate the expression
        const value = this.visit(ctx.expression());
        console.log(`Assigning value ${value} to ${target}`);
        
        // Update the variable's value
        targetState.value = value;
        
        // Update in VM memory
        const addr = this.variableAddresses.get(target);
        if (addr !== undefined) {
            this.vm.storeValue(addr, value);
        }
        
        return value;
    }

// Visit a parse tree produced by RustParser#referenceExpr
    visitReferenceExpr(ctx: rp.ReferenceExprContext): number {
        // Get the target expression (what is being borrowed)
        let targetExpr;
        if (ctx._target) {
            targetExpr = ctx._target;
        } else if (ctx.expression) {
            targetExpr = ctx.expression();
        } else if (ctx.getChild && typeof ctx.getChild === 'function' && ctx.getChild(1)) {
            targetExpr = ctx.getChild(1);
        }
        
        if (!targetExpr) {
            throw new BorrowError("Invalid reference syntax");
        }
        
        // Extract the variable name
        let targetVar;
        if (targetExpr instanceof rp.IdentifierContext) {
            targetVar = targetExpr.getText();
        } else if (typeof targetExpr.getText === 'function') {
            targetVar = targetExpr.getText();
        } else {
            throw new BorrowError("Can only borrow variables directly");
        }
        
        // Check if we're dealing with a &mut or just &
        const isMutable = ctx.getText().includes('&mut');
        
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
            // Reference variables are always immutable (unless explicitly re-declared as mut)
            this.declareVariable(refName, false, targetState.value);
        }
        
        // Store the reference name in a property so we can access it in variableDeclaration
        this.lastCreatedReference = refName;
        
        // Push a dummy value for the VM
        this.vm.pushInstruction("LDCN", 0);
        
        return 0; // Return a number per the visitor contract
    }

    // Visit a parse tree produced by RustParser#dereferenceExpr
    visitDereferenceExpr(ctx: rp.DereferenceExprContext): number {
        // Get the reference expression (what is being dereferenced)
        let refExpr;
        if (ctx._target) {
            refExpr = ctx._target;
        } else if (ctx.expression) {
            refExpr = ctx.expression();
        } else if (ctx.getChild && typeof ctx.getChild === 'function' && ctx.getChild(1)) {
            refExpr = ctx.getChild(1);
        }
        
        if (!refExpr) {
            throw new BorrowError("Invalid dereference syntax");
        }
        
        // Extract the reference variable name
        let refName;
        if (refExpr instanceof rp.IdentifierContext) {
            refName = refExpr.getText();
        } else if (typeof refExpr.getText === 'function') {
            refName = refExpr.getText();
        } else {
            throw new BorrowError("Can only dereference reference variables directly");
        }
        
        // Check if this is actually a reference
        if (!this.isReference(refName)) {
            throw new BorrowError(`${refName} is not a reference`);
        }
        
        // Get the target variable that this reference points to
        const targetVar = this.referenceMap.get(refName);
        if (!targetVar) {
            throw new BorrowError(`${refName} does not point to a valid variable`);
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
        // Get the dereference expression and the value
        if (!ctx._target || !ctx._value) {
            throw new BorrowError("Invalid dereference assignment syntax");
        }
        
        // Extract the reference name from the dereference expression
        let refName;
        
        // The structure depends on your grammar, so handle different possibilites
        if (ctx._target instanceof rp.DereferenceExprContext) {
            // Get the reference variable from the dereference expression
            const refExpr = ctx._target._target || ctx._target.expression && ctx._target.expression();
            
            if (!refExpr) {
                throw new BorrowError("Invalid dereference target");
            }
            
            refName = refExpr.getText();
        } else if (typeof ctx._target.getText === 'function') {
            // Handle simple case where target is directly accessible
            refName = ctx._target.getText().replace(/^\*/, ''); // Remove * prefix
        } else {
            throw new BorrowError("Cannot determine reference in dereference assignment");
        }
        
        // Check if this variable is a reference
        if (!this.isReference(refName)) {
            throw new BorrowError(`${refName} is not a reference`);
        }
        
        // Get the target variable name
        const targetVar = this.referenceMap.get(refName);
        if (!targetVar) {
            throw new BorrowError(`${refName} does not point to a valid variable`);
        }
        
        // Check if this is a mutable reference
        if (!this.isMutableReference(refName)) {
            throw new BorrowError(`Cannot assign through immutable reference ${refName}`);
        }
        
        // Get the target state
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
        
        return value;
    }

    // Visit a parse tree produced by RustParser#block
    visitBlock(ctx: rp.BlockContext): number {
        // Create a new scope for the block
        this.enterScope();
        
        try {
            let result = 0;
            
            // Execute all statements in the block
            if (ctx.statement) {
                const statements = ctx.statement();
                for (const statement of statements) {
                    result = this.visit(statement);
                    
                    // Check for early return
                    if (this.isReturning) {
                        return this.functionReturnValue !== null ? this.functionReturnValue : result;
                    }
                }
            }
            
            // Handle optional final expression (implicit return)
            if (ctx.expression && ctx.expression()) {
                result = this.visit(ctx.expression());
                
                // If this block is in a function, this could be an implicit return
                if (this.currentFunctionReturnType !== null) {
                    this.functionReturnValue = result;
                    this.isReturning = true;
                }
            }
            
            return result;
        } finally {
            // Always exit the scope when leaving the block
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

    // Visit a parse tree produced by RustParser#returnStatement
    visitReturnStatement(ctx: rp.ReturnStatementContext): number {
        // Check if we're in a function
        if (this.currentFunctionReturnType === null) {
            throw new Error("Return statement outside of function");
        }
        
        let returnValue = 0;
        
        // If there's an expression, evaluate it
        if (ctx.expression && ctx.expression()) {
            returnValue = this.visit(ctx.expression());
            
            // Push the return value onto the stack
            this.vm.pushInstruction("LDCN", returnValue);
        }
        
        // Set the return flags
        this.functionReturnValue = returnValue;
        this.isReturning = true;
        
        return returnValue;
    }

    // Visit a parse tree produced by RustParser#functionCall
    visitFunctionCall(ctx: rp.FunctionCallContext): number {
        if (!ctx.IDENTIFIER() || !ctx.IDENTIFIER().getText()) {
            throw new Error("Invalid function call");
        }
        
        const funcName = ctx.IDENTIFIER().getText();
        console.log(`Calling function: ${funcName}`);
        
        // Get the function definition
        const funcDef = this.functionDefinitions.get(funcName);
        if (!funcDef) {
            throw new Error(`Undefined function: ${funcName}`);
        }
        
        // Create a new scope for function execution
        this.enterScope();
        
        try {
            // Reset return state
            this.functionReturnValue = null;
            this.isReturning = false;
            
            // Process parameters - match arguments with parameters
            const params = funcDef.paramList()?.param() || [];
            const args = ctx.argList()?.expression() || [];
            
            if (params.length !== args.length) {
                throw new Error(`Function ${funcName} expects ${params.length} arguments but got ${args.length}`);
            }
            
            // Evaluate arguments and assign to parameters
            for (let i = 0; i < params.length; i++) {
                const param = params[i];
                const paramName = param._name?.text;
                const paramType = param.type()?.getText();
                
                if (!paramName || !paramType) {
                    throw new Error(`Invalid parameter at position ${i}`);
                }
                
                this.processParameter(paramName, paramType, args[i]);
            }
            
            // Set current function return type
            this.currentFunctionReturnType = funcDef._returnType?.getText() || null;
            
            // Execute the function body
            let result = this.visit(funcDef._functionBody);
            
            // If a return statement was executed, use that value
            if (this.isReturning && this.functionReturnValue !== null) {
                result = this.functionReturnValue;
            }
            
            // Reset return state
            this.currentFunctionReturnType = null;
            this.functionReturnValue = null;
            this.isReturning = false;
            
            return result;
        } finally {
            // Always exit the function scope
            this.exitScope();
        }
    }

    // Helper method to process function parameters
    private processParameter(paramName: string, paramType: string, argExpr: rp.ExpressionContext): void {
        // Check if this is a reference parameter
        const isMutableRef = paramType.startsWith('&mut');
        const isImmutableRef = paramType.startsWith('&') && !isMutableRef;
        
        if (isMutableRef || isImmutableRef) {
            // Parameter is a reference
            if (argExpr instanceof rp.ReferenceExprContext) {
                // Extract target variable name
                const targetExpr = argExpr._target;
                if (!targetExpr) {
                    throw new Error(`Invalid reference for parameter ${paramName}`);
                }
                
                // Get target variable name
                let targetVar: string;
                if (targetExpr instanceof rp.IdentifierContext) {
                    targetVar = targetExpr.getText();
                } else if (typeof targetExpr.getText === 'function') {
                    targetVar = targetExpr.getText();
                } else {
                    throw new Error(`Invalid reference target for parameter ${paramName}`);
                }
                
                // Create the borrow
                if (isMutableRef) {
                    this.borrowMutably(targetVar, paramName);
                } else {
                    this.borrowImmutably(targetVar, paramName);
                }
                
                // Set up the parameter as a reference
                const targetState = this.lookupVariable(targetVar);
                if (targetState) {
                    // Create a variable state for the parameter
                    const paramState = new VariableState(false, targetState.value);
                    this.variableStates.set(paramName, paramState);
                    this.currentScope().push(paramName);
                    
                    // Add to reference map
                    this.referenceMap.set(paramName, targetVar);
                    
                    // Allocate memory
                    const address = this.vm.allocateVariable();
                    this.variableAddresses.set(paramName, address);
                    this.vm.storeValue(address, targetState.value);
                }
            } else {
                throw new Error(`Parameter ${paramName} requires a reference`);
            }
        } else {
            // Value parameter - takes ownership
            const value = this.visit(argExpr);
            
            // Handle ownership transfer for variables
            if (argExpr instanceof rp.IdentifierContext) {
                const sourceVar = argExpr.getText();
                if (!this.referenceMap.has(sourceVar)) {
                    this.moveVariable(sourceVar, paramName);
                }
            }
            
            // Create the parameter as a normal variable
            this.declareVariable(paramName, false, value);
        }
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
        //console.log(`Visiting integer: ${value}`);
        this.vm.pushInstruction("LDCN", value);
        return value;
    }

    visitParenExpr(ctx: rp.ParenExprContext): number {
        //console.log(`Visiting parenthesized expression`);
        return this.visit(ctx.expression());
    }

    visitMulDivOp(ctx: rp.MulDivOpContext): number {
        //console.log(`Visiting multiplication/division operation`);
        
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

    // Visit a parse tree produced by RustParser#addSubOp
    visitAddSubOp(ctx: rp.AddSubOpContext): number {
        // Evaluate left and right operands
        const left = this.visit(ctx._left);
        const right = this.visit(ctx._right);
        
        // Get the operator
        const op = ctx._op.text;
        
        console.log(`Calculating: ${left} ${op} ${right}`);
        
        // Perform the operation
        let result: number;
        if (op === '+') {
            result = left + right;
        } else if (op === '-') {
            result = left - right;
        } else {
            throw new Error(`Unknown arithmetic operator: ${op}`);
        }
        
        console.log(`Result of ${left} ${op} ${right} = ${result}`);
        
        return result;
    }

    private functionDefinitions: Map<string, rp.FunctionDeclarationContext> = new Map();

    // Visit a parse tree produced by RustParser#functionDeclaration
    visitFunctionDeclaration(ctx: rp.FunctionDeclarationContext): number {
        if (!ctx._name || !ctx._name.text) {
            throw new Error("Function declaration must have a name");
        }
        
        const funcName = ctx._name.text;
        console.log(`Defining function: ${funcName}`);
        
        // Store the function definition for later use
        this.functionDefinitions.set(funcName, ctx);
        
        // Functions don't produce a value at declaration time
        return 0;
    }

    // Visit a parse tree produced by RustParser#ifStatement
    visitIfStatement(ctx: rp.IfStatementContext): number {
        if (!ctx._condition || !ctx._thenBlock) {
            throw new Error("If statement must have a condition and a block");
        }
        
        // Evaluate the condition
        const conditionValue = this.visit(ctx._condition);
        
        // Execute the appropriate branch based on condition
        if (conditionValue !== 0) {
            // Condition is true, execute the 'then' block
            return this.visit(ctx._thenBlock);
        } else if (ctx.elseBranch && ctx.elseBranch()) {
            // Condition is false, execute the 'else' branch if it exists
            return this.visit(ctx.elseBranch());
        }
        
        // No branch executed, return 0
        return 0;
    }

    // Visit a parse tree produced by RustParser#elseBranch
    visitElseBranch(ctx: rp.ElseBranchContext): number {
        // Handle 'else if' or simple 'else'
        if (ctx.block && ctx.block()) {
            return this.visit(ctx.block());
        } else if (ctx.ifStatement && ctx.ifStatement()) {
            return this.visit(ctx.ifStatement());
        }
        
        return 0;
    }

    // Visit a parse tree produced by RustParser#whileStatement
    visitWhileStatement(ctx: rp.WhileStatementContext): number {
        if (!ctx._condition || !ctx._loopBlock) {
            throw new Error("While statement must have a condition and a block");
        }
        
        console.log(`Starting while loop execution with condition: ${ctx._condition.getText()}`);
        
        let result = 0;
        let maxIterations = 1000; // Safety limit
        let iterations = 0;
        
        // Execute the loop as long as the condition is true
        while (iterations < maxIterations) {
            iterations++;
            
            // Evaluate the condition
            console.log(`[Iteration ${iterations}] Evaluating condition: ${ctx._condition.getText()}`);
            const conditionValue = this.visit(ctx._condition);
            console.log(`[Iteration ${iterations}] Condition evaluated to: ${conditionValue}`);
            
            // Exit the loop if condition is false (0 in our semantics)
            if (conditionValue === 0) {
                console.log(`[Iteration ${iterations}] Condition is false, exiting loop`);
                break;
            }
            
            // Execute the loop body
            console.log(`[Iteration ${iterations}] Executing loop body`);
            result = this.visit(ctx._loopBlock);
            
            // Debug variables after loop body execution
            if (ctx._condition.getText().includes('<') || ctx._condition.getText().includes('>') || 
                ctx._condition.getText().includes('==') || ctx._condition.getText().includes('!=')) {
                
                const parts = ctx._condition.getText().split(/[<>=!]+/);
                if (parts.length >= 2) {
                    const leftVar = parts[0].trim();
                    const rightVar = parts[1].trim();
                    
                    console.log(`[Debug] Variables in condition after iteration ${iterations}:`);
                    if (this.variableStates.has(leftVar)) {
                        console.log(`  ${leftVar} = ${this.variableStates.get(leftVar)?.value}`);
                    }
                    if (this.variableStates.has(rightVar)) {
                        console.log(`  ${rightVar} = ${this.variableStates.get(rightVar)?.value}`);
                    }
                }
            }
            
            // Check for early return from within loop
            if (this.isReturning) {
                console.log(`[Iteration ${iterations}] Early return detected, breaking loop`);
                break;
            }
        }
        
        if (iterations >= maxIterations) {
            throw new Error(`Potential infinite loop detected: exceeded ${maxIterations} iterations`);
        }
        
        console.log(`While loop completed after ${iterations} iterations with result: ${result}`);
        return result;
    }

    // Visit a parse tree produced by RustParser#equalityOp
    visitEqualityOp(ctx: rp.EqualityOpContext): number {
                const left = this.visit(ctx._left);
        const right = this.visit(ctx._right);
                const op = ctx._op.text;
        
        console.log(`Comparing ${left} ${op} ${right}`);
        
        // Ensure operands are numbers
        const leftNum = Number(left);
        const rightNum = Number(right);
        
        // Check for NaN
        if (isNaN(leftNum) || isNaN(rightNum)) {
            console.error(`Invalid comparison: ${left} ${op} ${right} - one or both operands are not numbers`);
            return 0; // Default to false for invalid comparisons
        }
        
        // Perform the comparison
        let result = false;
        switch (op) {
            case '>':
                result = leftNum > rightNum;
                break;
            case '>=':
                result = leftNum >= rightNum;
                break;
            case '<':
                result = leftNum < rightNum;
                break;
            case '<=':
                result = leftNum <= rightNum;
                break;
            case '==':
                result = leftNum === rightNum;
                break;
            case '!=':
                result = leftNum !== rightNum;
                break;
            default:
                throw new Error(`Unknown comparison operator: ${op}`);
        }
        
        const numResult = result ? 1 : 0;
        console.log(`Comparison result: ${left} ${op} ${right} = ${result} (${numResult})`);
        
        return numResult;
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