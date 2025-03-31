import * as rp from "./parser/src/RustParser";
import { BasicEvaluator } from "conductor/dist/conductor/runner";
import { IRunnerPlugin } from "conductor/dist/conductor/runner/types";
import {
    CharStream,
    CommonTokenStream,
    AbstractParseTreeVisitor,
} from "antlr4ng";
import { RustLexer } from "./parser/src/RustLexer";
import { RustVisitor } from "./parser/src/RustVisitor";
import { InstructionTag, VirtualMachine } from "./VirtualMachine";

export enum Type {
    I64 = "i64",
    REF = "ref",
    REF_MUT = "ref_mut",
    VOID = "void",
    ERORR = "error",
}

// Enhanced borrow states
enum BorrowState {
    Owned, // Variable is owned and can be used normally
    BorrowedMutably, // Variable has been mutably borrowed
    BorrowedImmutably, // Variable has been immutably borrowed
    Moved, // Variable's value has been moved and cannot be used
}

// Enhanced variable state tracking
class VariableState {
    state: BorrowState;
    mutable: boolean;
    address: number;
    typeInfo: TypeInfo; // Type information for the variable
    //type: Type = Type.I64; // Default type
    borrowers: string[] = []; // Track which variables are borrowing this one

    constructor(mutable: boolean, address: number, typeInfo: TypeInfo ) {
        this.state = BorrowState.Owned;
        this.mutable = mutable;
        this.address = address;
        this.typeInfo = typeInfo;
    }
}

// Runtime type information
export class TypeInfo {
    baseType: Type;
    refTarget?: string;  // For references, the name of the target variable
    
    constructor(baseType: Type, refTarget?: string) {
        this.baseType = baseType;
        this.refTarget = refTarget;
    }
    
    static fromTypeContext(ctx: rp.TypeContext): TypeInfo {
        const isRef = ctx._refFlag ? true : false;
        const isMutable = isRef && ctx._mutFlag ? true : false;
        
        if (isRef) {
            return new TypeInfo(isMutable ? Type.REF_MUT : Type.REF);
        } else {
            // Extract basic type from context
            const typeName = ctx.getText();
            if (typeName === "i64") {
                return new TypeInfo(Type.I64);
            } else {
                throw new Error(`Unsupported type: ${typeName}`);
            }
        }
    }
    
    toString(): string {
        if (this.baseType === Type.REF || this.baseType === Type.REF_MUT) {
            const mutPrefix = this.baseType === Type.REF_MUT ? "mut " : "";
            return `&${mutPrefix}${this.refTarget || "unknown"}`;
        }
        return this.baseType;
    }
}

class FunctionDefinition {
    label: number;
    paramList: rp.ParamListContext | null;
    paramTypes: Map<string, Type> = new Map();
    declaredReturnType: Type;

    constructor(
        label: number,
        params: rp.ParamListContext | null,
        returnType: Type
    ) {
        this.label = label;
        this.paramList = params;
        this.declaredReturnType = returnType;
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

export class RustEvaluatorVisitor
    extends AbstractParseTreeVisitor<number>
    implements RustVisitor<number> {
    private vm: VirtualMachine;
    private variableStates: Map<string, VariableState>;

    public getVariableStates(): Map<string, VariableState> {
        return this.variableStates;
    }
    private referenceMap: Map<string, string>; // Maps reference names to their target
    private functionDefinitions: Map<string, FunctionDefinition> = new Map();
    private lastCreatedReference: string | undefined; // Store the last created reference
    private isReturning: boolean = false;
    private currentFunctionReturnType: string | null = null;
    private loopEndLabels: string[] = [];
    private scopes: Map<string, any>[] = [new Map()]; // Stack of scopes

    // Add constructor to accept a VM instance
    constructor(vm?: VirtualMachine) {
        super();
        this.vm = vm || new VirtualMachine();
        this.variableStates = new Map<string, VariableState>();
        this.referenceMap = new Map<string, string>();
        this.scopes = [new Map()];
    }

    private enterScope(): void {
        // Create a new scope and push it onto the stack
        this.scopes.push(new Map());
        console.log(
            `[DEBUG] Entered new scope. Scope depth: ${this.scopes.length}`
        );
    }

    private exitScope(): void {
        if (this.scopes.length <= 1) {
            console.log("[WARNING] Attempted to exit global scope");
            return;
        }

        const currentScope = this.scopes.pop();
        console.log(
            `[DEBUG] Exiting scope. Variables in scope: ${Array.from(
                currentScope?.keys() || []
            ).join(", ")}`
        );

        // Clean up variables in this scope
        for (const [name, _] of currentScope || []) {
            // If this is a reference, release the borrow
            if (this.referenceMap.has(name)) {
                this.releaseBorrow(name);
                this.referenceMap.delete(name);
            }
            const state = this.variableStates.get(name);

            // Remove the variable state and address
            this.variableStates.delete(name);
            this.vm.pushInstruction(InstructionTag.FREE, state.address);
        }
    }

    // Lookup a variable across all scopes (inner to outer)
    private lookupVariable(name: string): VariableState | undefined {
        // Check each scope from innermost to outermost
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const scope = this.scopes[i];
            if (scope.has(name)) {
                return this.variableStates.get(name);
            }
        }
        return undefined;
    }

    // Declare a variable in the current scope
    private declareVariable(name: string, mutable: boolean, typeInfo: TypeInfo = new TypeInfo(Type.I64), initialValue: number = 0): void {
        // Register in current scope
        const currentScope = this.scopes[this.scopes.length - 1];
        currentScope.set(name, true);

        // Create variable state
        const addr = this.vm.allocateVariable();
        const state = new VariableState(mutable, addr, typeInfo);
        this.variableStates.set(name, state);
        
        // Push the initial value to the stack
        this.vm.pushInstruction(InstructionTag.LDCN, initialValue);
        
        // Then store it
        this.vm.pushInstruction(InstructionTag.STORE, addr);
        
        console.log(
            `[DEBUG] Declared variable: ${name}, mutable: ${mutable}, addr: ${addr}, type: ${typeInfo.toString()}`
        );
    }

    // Ownership management
    private moveVariable(sourceVar: string, destVar: string, isMutable: boolean): void {
        const sourceState = this.lookupVariable(sourceVar);

        if (!sourceState) {
            throw new OwnershipError(
                `Cannot move from undefined variable: ${sourceVar}`
            );
        }

        if (sourceState.state === BorrowState.Moved) {
            throw new OwnershipError(
                `Cannot use ${sourceVar} after it has been moved`
            );
        }

        if (sourceState.borrowers.length > 0) {
            throw new BorrowError(`Cannot move ${sourceVar} while it is borrowed`);
        }

        // Move ownership
        const newState = new VariableState(isMutable, sourceState.address, sourceState.typeInfo);
        this.variableStates.set(destVar, newState);

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
            throw new BorrowError(
                `Cannot borrow ${targetVar} after it has been moved`
            );
        }

        if (!targetState.mutable) {
            throw new BorrowError(
                `Cannot mutably borrow immutable variable ${targetVar}`
            );
        }

        if (targetState.borrowers.length > 0) {
            throw new BorrowError(
                `Cannot mutably borrow ${targetVar} as it is already borrowed`
            );
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
            throw new BorrowError(
                `Cannot borrow ${targetVar} after it has been moved`
            );
        }

        if (targetState.state === BorrowState.BorrowedMutably) {
            throw new BorrowError(
                `Cannot immutably borrow ${targetVar} as it is already mutably borrowed`
            );
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

        if (
            state.state === BorrowState.BorrowedMutably &&
            !this.referenceMap.has(varName)
        ) {
            throw new BorrowError(
                `Cannot read ${varName} while it is mutably borrowed`
            );
        }
    }

    private checkWriteAccess(varName: string): void {
        const state = this.lookupVariable(varName);

        if (!state) {
            throw new OwnershipError(`Variable ${varName} not declared`);
        }

        if (!state.mutable) {
            throw new OwnershipError(
                `Cannot assign to immutable variable ${varName}`
            );
        }

        if (state.state === BorrowState.Moved) {
            throw new OwnershipError(
                `Cannot assign to ${varName} after it has been moved`
            );
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

        return (
            targetState.state === BorrowState.BorrowedMutably &&
            targetState.borrowers.includes(refName)
        );
    }

    // Add a method to check if a variable is a reference
    private isReference(varName: string): boolean {
        return this.referenceMap.has(varName);
    }

    private getExpressionType(expr: rp.ExpressionContext): Type {
        if (expr instanceof rp.IntContext || expr instanceof rp.EqualityOpContext || expr instanceof rp.AddSubOpContext || expr instanceof rp.MulDivOpContext || expr instanceof rp.ParenExprContext || expr instanceof rp.UnaryOpContext) {
            // Assuming all arithmetic expressions are i64
            return Type.I64;
        } else if (expr instanceof rp.IdentifierContext) {
            // Check if the variable is defined
            const varName = expr.getText();
            const state = this.lookupVariable(varName);
            if (state) {
                return state.typeInfo.baseType;
            } else {
                throw new Error(`Undefined variable: ${varName}`);
            }
        } else if (expr instanceof rp.FunctionCallContext) {
            // Check if the function is defined
            const funcName = expr.IDENTIFIER().getText();
            const funcDef = this.functionDefinitions.get(funcName);
            if (funcDef) {
                return funcDef.declaredReturnType;
            } else {
                throw new Error(`Undefined function: ${funcName}`);
            }
        } else {
            throw new Error('Unsupported expression type');
        }
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

    public compileAndRun(tree: any): number {
        // Reset state
        this.reset();
        this.vm.reset();

        // COMPILATION PHASE: Generate VM instructions
        this.visit(tree);

        // Mark the end of the program
        this.vm.pushInstruction(InstructionTag.DONE);

        // EXECUTION PHASE: Run the VM code
        console.log("[EVALUATOR] Compilation complete, running VM...");
        const result = this.vm.run();
        console.log(`[EVALUATOR] Program executed with result: ${result}`);

        return result;
    }

    /**
     * Reset all state for a new evaluation
     */
    public reset(): void {
        // Clear variable tracking
        this.variableStates = new Map();
        this.referenceMap = new Map();

        // Reset scopes
        this.scopes = [new Map()];

        // Reset function tracking
        this.functionDefinitions = new Map();
        this.currentFunctionReturnType = null;

        // Reset control flow flags
        this.isReturning = false;

        // Reset reference tracking
        this.lastCreatedReference = null;
        this.loopEndLabels = [];
        
        console.log("[EVALUATOR] State reset complete");
    }

    // Visit methods for grammar

    // Visit a parse tree produced by RustParser#prog
    visitProg(ctx: rp.ProgContext): number {
        console.log(`[COMPILE] Program`);

        // Compile all statements in the program
        const statements = ctx.statement() || [];
        for (const statement of statements) {
            this.visit(statement);
        }

        let finalExpression = null;
        // Check if the last child is an expression node
        if (ctx.getChildCount() > 0 && ctx.getChild(ctx.getChildCount() - 1) instanceof rp.ExpressionContext) {
            finalExpression = ctx.getChild(ctx.getChildCount() - 1) as rp.ExpressionContext;
        } else if (ctx.getChildCount() > 0) {
            const lastChild = ctx.getChild(ctx.getChildCount() - 1);
            if (lastChild instanceof rp.ExpressionContext) {
                finalExpression = lastChild;
            }
        }
        
        if (finalExpression) {
            console.log(`[COMPILE] Final expression found`);
            this.visit(finalExpression);
        }
        
        return 0;
    }

    // Variable declaration with dynamic type checking
    visitVariableDeclaration(ctx: rp.VariableDeclarationContext): number {
        if (!ctx._name || !ctx._value) {
            throw new Error("Invalid variable declaration");
        }
        
        const name = ctx._name.text;
        const isMutable = ctx._mutFlag ? true : false;
        
        console.log(`[COMPILE] Declaring variable: ${name}, mutable: ${isMutable}`);
        
        // Extract the type
        let typeInfo: TypeInfo;
        if (ctx.type()) {
            typeInfo = TypeInfo.fromTypeContext(ctx.type());
        } else {
            typeInfo = new TypeInfo(Type.I64); // Default type
        }
        
        // Create the variable state
        const addr = this.vm.allocateVariable();
        const state = new VariableState(isMutable, addr, typeInfo);
        this.variableStates.set(name, state);
        this.currentScope().set(name, true);
        
        // Evaluate the expression, which puts its value on the stack
        this.visit(ctx._value);
        
        // Store the value to the variable
        this.vm.pushInstruction(InstructionTag.STORE, addr);
        
        return 0;
    }

    // Visit a parse tree produced by RustParser#standardAssignment
    visitStandardAssignment(ctx: rp.StandardAssignmentContext): number {
        const target = ctx.IDENTIFIER().getText();
        console.log(`[COMPILE] Assignment to: ${target}`);

        // Check if the variable exists and is mutable
        const targetState = this.lookupVariable(target);
        if (!targetState) {
            throw new Error(`Cannot assign to undefined variable: ${target}`);
        }

        this.checkWriteAccess(target);

        // Evaluate the expression, which puts its value on the stack
        const value = this.visit(ctx.expression());
        const type = this.getExpressionType(ctx.expression());

        if (type !== targetState.typeInfo.baseType) {
            throw new Error(
                `Type mismatch: cannot assign ${type} to ${targetState.typeInfo.baseType}`
            );
        }

        // Evaluate the expression
        console.log(`Assigning value ${value} to ${target}`);
        this.vm.pushInstruction(InstructionTag.STORE, targetState.address);

        return 0;
    }

    // Visit a parse tree produced by RustParser#referenceExpr
    visitReferenceExpr(ctx: rp.ReferenceExprContext): number {
        const targetExpr = ctx._target;
        let targetVar: string;

        if (!targetExpr) {
            throw new BorrowError("Invalid reference syntax");
        }

        // Extract the variable name
        if (targetExpr instanceof rp.IdentifierContext) {
            targetVar = targetExpr.getText();
        } else if (
            targetExpr instanceof rp.ReferenceExprContext ||
            targetExpr instanceof rp.DereferenceExprContext
        ) {
            // TODO: Handle nested references
            throw new BorrowError("Nested references not supported");
        } else {
            throw new BorrowError("Can only borrow variables directly");
        }

        // Check if we're dealing with a &mut or just &
        const isMutable = ctx._mutFlag ? true : false;

        // Generate a synthetic name for the reference
        const refName = `ref_to_${targetVar}_${Date.now()}`;

        // Perform the borrow
        if (isMutable) {
            this.borrowMutably(targetVar, refName);
        } else {
            this.borrowImmutably(targetVar, refName);
        }

        // Create variable state with proper type info for the reference
        const targetState = this.lookupVariable(targetVar);
        if (targetState) {
            // Create a reference type that points to the target var
            const refTypeInfo = new TypeInfo(
                isMutable ? Type.REF_MUT : Type.REF,
                targetVar
            );
            
            // Create a variable state for the reference
            const addr = this.vm.allocateVariable();
            const refState = new VariableState(false, addr, refTypeInfo);
            this.variableStates.set(refName, refState);
            
            // Register in current scope
            this.currentScope().set(refName, true);
            
            // Store the value (address) of the target in the reference
            this.vm.pushInstruction(InstructionTag.LDCN, targetState.address);
            this.vm.pushInstruction(InstructionTag.STORE, addr);
        }

        // Store the reference name in a property so we can access it in variableDeclaration
        this.lastCreatedReference = refName;

        return 0;
    }

    // Visit a parse tree produced by RustParser#dereferenceExpr
    visitDereferenceExpr(ctx: rp.DereferenceExprContext): number {
        // Get the reference expression (what is being dereferenced)
        const refExpr = ctx._target;
        if (!refExpr || !(refExpr instanceof rp.IdentifierContext)) {
            throw new BorrowError("Can only dereference variables");
        }

        const refName = refExpr.getText();
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

        // Push the referenced address to the VM stack
        this.vm.pushInstruction(InstructionTag.LOAD, targetState.address);
        // Fetch the value from the address
        this.vm.pushInstruction(InstructionTag.FETCH);

        return 0;
    }

    // Visit a parse tree produced by RustParser#dereferenceAssignment
    visitDereferenceAssignment(ctx: rp.DereferenceAssignmentContext): number {
        // Get the dereference expression and the value
        if (!ctx._target || !ctx._value) {
            throw new BorrowError("Invalid dereference assignment syntax");
        }

        // Extract the reference name from the dereference expression
        let refName: string;

        // The structure depends on your grammar, so handle different possibilites
        if (ctx._target instanceof rp.DereferenceExprContext) {
            // Get the reference variable from the dereference expression
            const refExpr =
                ctx._target._target ||
                (ctx._target.expression && ctx._target.expression());

            if (!refExpr) {
                throw new BorrowError("Invalid dereference target");
            }

            refName = refExpr.getText();
        } else {
            throw new BorrowError(
                "Cannot determine reference in dereference assignment"
            );
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
            throw new BorrowError(
                `Cannot assign through immutable reference ${refName}`
            );
        }

        // Get the target state
        const targetState = this.lookupVariable(targetVar);
        if (!targetState) {
            throw new BorrowError(`Target of reference ${refName} no longer exists`);
        }

        // Evaluate the value expression
        this.visit(ctx._value);

        // Push instruction to store the new value at the target's address
        this.vm.pushInstruction(InstructionTag.STORE, targetState.address);

        return 0;
    }

    // Visit a parse tree produced by RustParser#block
    visitBlock(ctx: rp.BlockContext): number {
        console.log(`[COMPILE] Code block`);

        // Enter a new variable scope if not in function body
        if (this.currentFunctionReturnType === null) {
            this.enterScope();
        }

        // Compile all statements in the block
        const statements = ctx.statement() || [];
        for (const statement of statements) {
            this.visit(statement);
        }

        // Compile the optional final expression (for implicit returns)
        if (ctx.expression && ctx.expression()) {
            this.visit(ctx.expression());
            // Check the type of the last expression if function block
            if (this.currentFunctionReturnType) {
                const type = this.getExpressionType(ctx.expression());
                if (type !== this.currentFunctionReturnType) {
                    throw new Error(
                        `Function return type mismatch: expected ${this.currentFunctionReturnType}, got ${type}`
                    )
                } else {
                    // Push the return value to the stack
                    this.vm.pushInstruction(InstructionTag.RETURN);
                    this.isReturning = true;
                }
            }

        }

        if (this.currentFunctionReturnType === null) {
            // Exit the scope if not in a function body
            this.exitScope();
        }

        return 0;
    }

    // Visit a parse tree produced by RustParser#returnStatement
    visitReturnStatement(ctx: rp.ReturnStatementContext): number {
        // Check if we're in a function
        if (this.currentFunctionReturnType === null) {
            throw new Error("Return statement outside of function");
        }

        let returnType: Type = Type.VOID;

        // If there's an expression, evaluate it
        if (ctx.expression()) {
            this.visit(ctx.expression());
            returnType = this.getExpressionType(ctx.expression());
            
            // Check if the return type matches
            if (returnType !== this.currentFunctionReturnType) {
                throw new Error(
                    `Function return type mismatch: expected ${this.currentFunctionReturnType}, got ${returnType}`
                );
            }
        } else {
            // For void returns, push a dummy value
            this.vm.pushInstruction(InstructionTag.LDCN, 0);
        }

        // Return to the caller
        this.vm.pushInstruction(InstructionTag.RETURN);
        this.isReturning = true;

        return 0;
    }

    // Function call with dynamic type checking
    visitFunctionCall(ctx: rp.FunctionCallContext): number {
        if (!ctx.IDENTIFIER() || !ctx.IDENTIFIER().getText()) {
            throw new Error("Invalid function call");
        }
        
        const funcName = ctx.IDENTIFIER().getText();
        console.log(`[COMPILE] Calling function: ${funcName}`);
        
        // Get the function definition
        const funcDef = this.functionDefinitions.get(funcName);
        if (!funcDef) {
            throw new Error(`Undefined function: ${funcName}`);
        }
        
        // Process arguments
        const params = funcDef.paramList?.param() || [];
        const args = ctx.argList()?.expression() || [];
        
        if (params.length !== args.length) {
            throw new Error(`Function ${funcName} expects ${params.length} arguments but got ${args.length}`);
        }
        
        // Push arguments onto the stack in the correct order for the function
        // For a function add(x, y), x should be at params[0], y at params[1]
        for (let i = 0; i < args.length; i++) {
            // Evaluate the argument and push it onto the stack
            this.visit(args[i]);
            
            // Type checking can be done at compile time
            const argType = this.getExpressionType(args[i]);
            const paramType = TypeInfo.fromTypeContext(params[i].type()).baseType;
            
            // Verify type compatibility
            if (argType !== paramType) {
                throw new Error(`Type mismatch in function call: Parameter ${params[i]._name?.text} expects ${paramType} but got ${argType}`);
            }
        }
        
        // Generate the function call instruction
        this.vm.pushInstruction(InstructionTag.CALL, funcDef.label);
        
        return 0;
    }

    // Visit a parse tree produced by RustParser#functionDeclaration
    visitFunctionDeclaration(ctx: rp.FunctionDeclarationContext): number {
        if (!ctx._name || !ctx._name.text) {
            throw new Error("Function declaration must have a name");
        }
        
        const funcName = ctx._name.text;
        const params = ctx.paramList();
        let returnType: Type;

        if (!ctx._returnType) {
            returnType = Type.VOID;
        } else if (ctx._returnType._refFlag) {
            throw new Error("Reference return types are not supported");
        } else {
            returnType = ctx._returnType.getText() as Type;
        }

        console.log(`Defining function: ${funcName}`);
        
        // Generate a label for the function's end
        const endOfFnLabel = `end_${funcName}`;
        
        // Store the current instruction counter as the function's entry point
        const entryPoint = this.vm.getInstructionCounter() + 1; // +1 to skip over the initial GOTO
        
        // Add function to registry with its entry point
        const fnDef = new FunctionDefinition(entryPoint, params, returnType);
        this.functionDefinitions.set(funcName, fnDef);
        
        // Add GOTO to skip over the function body during normal execution
        this.vm.pushGoto(endOfFnLabel);
        
        // Save the function return type
        this.currentFunctionReturnType = fnDef.declaredReturnType;
        this.isReturning = false;
        
        // Enter a scope for the function
        this.enterScope();
        
                if (params) {
// Create parameter variables in order
            let paramIndex = 0;
            for (const param of params.param()) {
                const paramName = param._name?.text;
                const paramType = param.type();
                if (!paramName || !paramType) {
                    throw new Error("Invalid parameter definition");
                }

                // Register parameter variables in the correct order
                const type = this.processParameter(paramName, paramType, paramIndex);
                fnDef.paramTypes.set(paramName, type);
                paramIndex++;
            }
        }

        // Visit the function body
        this.visit(ctx._functionBody);

        // Ensure all paths have a return for non-void functions
        if (!this.isReturning && this.currentFunctionReturnType !== Type.VOID) {
            throw new Error(`Function ${funcName} must return a value of type ${this.currentFunctionReturnType}`);
        }
        
        // Add a default return for void functions or as a safety
        if (!this.isReturning) {
            this.vm.pushInstruction(InstructionTag.LDCN, 0); // Default return value
            this.vm.pushInstruction(InstructionTag.RETURN);
        }

        // Clean up the function's scope
        this.exitScope();

        // Add the end label for the function
        this.vm.addLabel(endOfFnLabel);

        // Reset state for the next declarations
        this.currentFunctionReturnType = null;
        this.isReturning = false;

        return 0;
    }

    // Process parameters with runtime type checking
    private processParameter(
        paramName: string,
        paramType: rp.TypeContext,
        paramIndex: number
    ): Type {
        // Extract TypeInfo from the parameter type context
        const typeInfo = TypeInfo.fromTypeContext(paramType);
        
        // Allocate memory for the parameter (x is 1024, y is 1028)
        const addr = 1024 + (paramIndex * 4); // Using fixed addresses for params
        
        // Create a variable state with the proper type info
        const varState = new VariableState(false, addr, typeInfo);
        this.variableStates.set(paramName, varState);
        this.currentScope().set(paramName, true);
        
        return typeInfo.baseType;
    }

    // Visit a parse tree produced by RustParser#ifStatement
    visitIfStatement(ctx: rp.IfStatementContext): number {
        if (!ctx._condition || !ctx._thenBlock) {
            throw new Error("If statement must have a condition and a block");
        }

        console.log(`[COMPILE] If statement`);

        // Generate unique labels for jump targets
        const elseLabel = `else_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const endIfLabel = `endif_${Date.now()}_${Math.floor(
            Math.random() * 1000
        )}`;

        // Compile the condition expression
        this.visit(ctx._condition);

        // If condition is false, jump to else branch or end
        this.vm.pushJof(elseLabel);

        // Compile the 'then' block
        this.visit(ctx._thenBlock);

        // Jump to end of if statement (skip else)
        this.vm.pushGoto(endIfLabel);

        // Add the else label
        this.vm.addLabel(elseLabel);

        // Compile the else branch if it exists
        if (ctx.elseBranch && ctx.elseBranch()) {
            this.visit(ctx.elseBranch());
        }

        // Add the end label
        this.vm.addLabel(endIfLabel);

        return 0;
    }

    // Visit a parse tree produced by RustParser#whileStatement
    visitWhileStatement(ctx: rp.WhileStatementContext): number {
        if (!ctx._condition || !ctx._loopBlock) {
            throw new Error("While statement must have a condition and a block");
        }

        console.log(`[COMPILE] While loop`);

        // Generate unique labels for jump targets
        const loopStartLabel = `loop_start_${Date.now()}_${Math.floor(
            Math.random() * 1000
        )}`;
        const loopEndLabel = `loop_end_${Date.now()}_${Math.floor(
            Math.random() * 1000
        )}`;

        this.loopEndLabels.push(loopEndLabel);

        // Add the loop start label
        this.vm.addLabel(loopStartLabel);

        // Compile the condition expression
        this.visit(ctx._condition);

        // If condition is false, jump to end of loop
        this.vm.pushJof(loopEndLabel);

        // Compile the loop body
        this.visit(ctx._loopBlock);

        // Jump back to the start of the loop
        this.vm.pushGoto(loopStartLabel);

        // Add the loop end label
        this.vm.addLabel(loopEndLabel);
        this.loopEndLabels.pop();

        return 0;
    }

    // Visit a parse tree produced by RustParser#equalityOp
    visitEqualityOp(ctx: rp.EqualityOpContext): number {
        // Evaluate the left and right expressions
        this.visit(ctx.expression(0));
        this.visit(ctx.expression(1));

        const op = ctx._op.text;
        console.log(`[COMPILE] Comparison operation: ${op}`);

        // Push the appropriate instruction
        switch (op) {
            case ">":
                this.vm.pushInstruction(InstructionTag.GT);
                break;
            case ">=":
                this.vm.pushInstruction(InstructionTag.GE);
                break;
            case "<":
                this.vm.pushInstruction(InstructionTag.LT);
                break;
            case "<=":
                this.vm.pushInstruction(InstructionTag.LE);
                break;
            case "==":
                this.vm.pushInstruction(InstructionTag.EQ);
                break;
            case "!=":
                this.vm.pushInstruction(InstructionTag.NE);
                break;
            default:
                throw new Error(`Unknown comparison operator: ${op}`);
        }

        return 0;
    }

    // Visit a parse tree produced by RustParser#breakStatement
    visitBreakStatement(ctx: rp.BreakStatementContext): number {
        console.log(`[DEBUG] Break statement encountered`);

        if (this.loopEndLabels.length === 0) {
            throw new Error("Break statement outside of loop");
        }
        const currentLoopEndLabel =
            this.loopEndLabels[this.loopEndLabels.length - 1];
        this.vm.pushGoto(currentLoopEndLabel);
        return 0;
    }
    private currentScope(): Map<string, any> {
        return this.scopes[this.scopes.length - 1];
    }

    // Visit a parse tree produced by RustParser#int
    visitInt(ctx: rp.IntContext): number {
        const value = parseInt(ctx.INT().getText());
        console.log(`[COMPILE] Loading constant: ${value}`);
        this.vm.pushInstruction(InstructionTag.LDCN, value);
        return 0;
    }

    // Visit identifiers (variables)
    visitIdentifier(ctx: rp.IdentifierContext): number {
        const name = ctx.IDENTIFIER().getText();
        const state = this.lookupVariable(name);
        
        if (!state) {
            throw new Error(`Variable ${name} is not defined`);
        }
        
        this.checkReadAccess(name);
        
        // Load the variable value onto the stack
        this.vm.pushInstruction(InstructionTag.LOAD, state.address);
        
        return 0;
    }

    visitAddSubOp(ctx: rp.AddSubOpContext): number {
        // First visit the left operand
        this.visit(ctx.expression(0));
        
        // Then visit the right operand
        this.visit(ctx.expression(1));
        
        // Generate the operation instruction
        const op = ctx._op.text;
        if (op === '+') {
            this.vm.pushInstruction(InstructionTag.PLUS);
        } else {
            this.vm.pushInstruction(InstructionTag.MINUS);
        }
        
        return 0;
    }

    visitMulDivOp(ctx: rp.MulDivOpContext): number {
        // First visit the left operand
        this.visit(ctx.expression(0));
        
        // Then visit the right operand
        this.visit(ctx.expression(1));
        
        // Generate the operation instruction
        const op = ctx._op.text;
        if (op === '*') {
            this.vm.pushInstruction(InstructionTag.TIMES);
        } else {
            this.vm.pushInstruction(InstructionTag.DIVIDE);
        }
        
        return 0;
    }

    // Visit a parse tree produced by RustParser#unaryOp
    visitUnaryOp(ctx: rp.UnaryOpContext): number {
        // First, evaluate the expression being negated
        this.visit(ctx.expression());
        
        // Get the operator (should be '-')
        const op = ctx.getChild(0).getText();
        
        if (op === '-') {
            // Generate negate instruction
            this.vm.pushInstruction(InstructionTag.NEG);
            console.log(`[COMPILE] Unary negation`);
        } else {
            throw new Error(`Unsupported unary operator: ${op}`);
        }
        
        return 0;
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
            this.visitor.reset();
            // Create the lexer and parser
            const inputStream = CharStream.fromString(chunk);
            const lexer = new RustLexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new rp.RustParser(tokenStream);

            // Parse the input
            const tree = parser.prog();

            // COMPILATION PHASE: Generate VM instructions
            this.visitor.visit(tree);

            // Mark the end of the program
            vm.pushInstruction(InstructionTag.DONE);

            // Check for a final standalone variable reference
            const lines = chunk.split('\n');
            const lastLine = lines[lines.length - 1].trim();
            const varMatch = lastLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*);?\s*(\/\/.*)?$/);
            if (varMatch) {
                const varName = varMatch[1];
                console.log(`[EVALUATOR] Final expression is variable: ${varName}`);
                const varState = this.visitor.getVariableStates().get(varName);
                if (varState) {
                    // Manually add instruction to load this variable
                    vm.pushInstruction(InstructionTag.LOAD, varState.address);
                }
            }

            // EXECUTION PHASE: Run the VM code
            console.log(`[EVALUATOR] Running compiled code...`);
            const result = vm.run();

            // Send the result to the REPL
            this.conductor.sendOutput(`Output: ${result}`);
        } catch (error) {
            if (error instanceof Error) {
                this.conductor.sendOutput(`Error: ${error.message}`);
            } else {
                this.conductor.sendOutput(`Error: ${String(error)}`);
            }
        }
    }
}
