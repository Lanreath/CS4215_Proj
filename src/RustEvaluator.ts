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

export enum Primitive {
    i32 = "i32",
    BOOL = "bool",
    VOID = "void",
    ERROR = "error",
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
    typeInfo: Type; // Type information for the variable
    borrowers: string[] = []; // Track which variables are borrowing this one

    constructor(mutable: boolean, address: number, typeInfo: Type) {
        this.state = BorrowState.Owned;
        this.mutable = mutable;
        this.address = address;
        this.typeInfo = typeInfo;
    }

    shouldDrop(): boolean {
        return this.borrowers.length === 0 && this.state !== BorrowState.Moved;
    }
}

// Runtime type information
export class Type {
    baseType: Type | Primitive; // Base type of the variable
    refTarget?: string;  // For references, the name of the target variable
    isMutable: boolean;
    hasCopyTrait: boolean;

    constructor(baseType: Type | Primitive, refTarget?: string, isMutable: boolean = false) {
        this.baseType = baseType;
        this.refTarget = refTarget;
        this.isMutable = isMutable;

        this.hasCopyTrait = false;
    }

    static fromTypeContext(ctx: rp.TypeContext): Type {
        if (ctx.referenceType()) {
            let refType = ctx.referenceType();
            const isMutable = refType._mutFlag ? true : false;
            if (!refType._baseType) {
                throw new Error("Invalid reference type context");
            }
            const type = this.fromTypeContext(refType._baseType);
            // Return a reference type
            return new Type(type, undefined, isMutable);
        } else if (ctx.atomicType()) {
            let primitiveType = ctx.atomicType()
            const typeName = primitiveType.getText();
            if (typeName == Primitive.i32) {
                return new Type(Primitive.i32);
            } else if (typeName == Primitive.BOOL) {
                return new Type(Primitive.BOOL);
            } else {
                throw new Error(`Unsupported type: ${typeName}`);
            }
        }
        throw new Error(`Unsupported type: ${ctx.getText()}`);
    }

    toString(): string {
        if (this.baseType instanceof Type) {
            // If this is a reference type, include the target variable name
            const mutPrefix = this.isMutable ? "mut " : "";
            return `&${mutPrefix}${this.refTarget || this.baseType}`;
        }
        return this.baseType.toString();
    }

    equals(other: Type): boolean {
        // Check for reference equality first
        if (this === other) return true;
        // Check if reference mutability and copy trait match
        if (this.isMutable !== other.isMutable) return false;
        if (this.hasCopyTrait !== other.hasCopyTrait) return false;
        // Check if the base types are the same
        if (this.baseType instanceof Type && other.baseType instanceof Type) {
            return this.baseType.equals(other.baseType);
        }
        // Check if both are primitive types
        return this.baseType == other.baseType;
    }
}

class FunctionDefinition {
    label: number;
    paramList: rp.ParamListContext | null;
    paramTypes: Map<string, Type> = new Map();
    declaredReturnType: Type
    hasReturned: boolean = false;

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
    public variableStates: Map<string, VariableState>;

    public getVariableStates(): Map<string, VariableState> {
        return this.variableStates;
    }
    public referenceMap: Map<string, string>; // Maps reference names to their target
    private functionDefinitions: Map<string, FunctionDefinition> = new Map();
    private currentFunction: FunctionDefinition | null = null;
    private loopEndLabels: string[] = [];
    public scopes: Map<string, any>[] = [new Map()]; // Stack of scopes

    // Add constructor to accept a VM instance
    constructor(vm?: VirtualMachine) {
        super();
        this.vm = vm || new VirtualMachine();
        this.variableStates = new Map<string, VariableState>();
        this.referenceMap = new Map<string, string>();
        this.functionDefinitions = new Map();
        this.scopes = [new Map()];
        this.loopEndLabels = [];
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

        // Get the current scope before removing it
        const currentScope = this.scopes[this.scopes.length - 1];

        // Pop it from the stack
        this.scopes.pop();

        console.log(`[DEBUG] Exiting scope with variables: ${Array.from(currentScope.keys()).join(", ")}`);

        // Clean up ALL variables in this scope
        for (const name of currentScope.keys()) {
            console.log(`[DEBUG] Cleaning up variable: ${name}`);

            // Get the state
            const state = this.variableStates.get(name);
            if (state) {
                // Handle references
                if (this.referenceMap.has(name)) {
                    this.releaseBorrow(name);
                }
                if (state.shouldDrop()) {
                    console.log(`[DEBUG] Dropping variable ${name} as it has no borrowers`);
                    this.variableStates.delete(name);
                    this.vm.pushInstruction(InstructionTag.FREE, state.address);
                } else {
                    console.log(`[DEBUG] Not dropping ${name} as it has ${state.borrowers.length} borrowers`);
                }
            }
        }
    }

    // Lookup a variable across all scopes (inner to outer)
    public lookupVariable(name: string): VariableState | undefined {
        console.log(`[DEBUG] lookupVariable('${name}') called with ${this.scopes.length} scopes`);

        // Check each scope from innermost to outermost
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const scope = this.scopes[i];
            if (scope.has(name)) {
                console.log(`[DEBUG] Found '${name}' in scope ${i}`);
                const state = this.variableStates.get(name);

                // Ensure the variable state is still valid
                if (!state) {
                    console.log(`[WARNING] Variable '${name}' found in scope but missing from variableStates`);
                    return undefined;
                }

                return state;
            }
        }

        console.log(`[DEBUG] Variable '${name}' not found in any scope`);
        return undefined;
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

        if (targetState.state === BorrowState.BorrowedMutably) {
            throw new BorrowError(
                `Cannot mutably borrow ${targetVar} as it is already mutably borrowed`
            );
        }

        if (targetState.state === BorrowState.BorrowedImmutably && targetState.borrowers.length > 0) {
            throw new BorrowError(
                `Cannot mutably borrow ${targetVar} as it is already immutably borrowed`
            );
        }

        // Register the borrow
        targetState.borrowers.push(borrowerVar);
        targetState.state = BorrowState.BorrowedMutably;

        // Record the reference relationship
        this.referenceMap.set(borrowerVar, targetVar);

        console.log(`[BORROW] Variable ${targetVar} mutably borrowed by ${borrowerVar}`);
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

        console.log(`[BORROW] Variable ${targetVar} immutably borrowed by ${borrowerVar}`);
    }

    private releaseBorrow(refName: string): void {
        // Get the target variable this reference is borrowing
        const targetVar = this.referenceMap.get(refName);
        if (targetVar === undefined) {
            console.log(`[WARNING] Tried to release borrow for ${refName} but no target found`);
            return;
        }

        // Get the target state
        const targetState = this.lookupVariable(targetVar);
        if (!targetState) {
            console.log(`[WARNING] Target variable ${targetVar} not found when releasing borrow`);
            return;
        }

        // Remove this borrower from the target's borrowers list
        const index = targetState.borrowers.indexOf(refName);
        if (index !== -1) {
            targetState.borrowers.splice(index, 1);
            console.log(`[BORROW] Removed ${refName} from borrowers of ${targetVar}`);
        }

        // Update the target's state based on remaining borrowers
        if (targetState.borrowers.length === 0) {
            // No more borrowers, restore to Owned state
            targetState.state = BorrowState.Owned;
            console.log(`[BORROW] Restored ${targetVar} to Owned state`);
        } else if (targetState.state === BorrowState.BorrowedMutably) {
            // If there are still borrowers but it was mutably borrowed,
            // it should now be immutably borrowed (because we just removed a mutable borrow)
            let hasMutableBorrower = false;
            for (const borrower of targetState.borrowers) {
                const borrowerState = this.lookupVariable(borrower);
                if (borrowerState && borrowerState.typeInfo.baseType instanceof Type && borrowerState.typeInfo.baseType.isMutable) {
                    hasMutableBorrower = true;
                    break;
                }
            }
            if (!hasMutableBorrower) {
                targetState.state = BorrowState.BorrowedImmutably;
                console.log(`[BORROW] Changed ${targetVar} from mutable to immutable borrow`);
            }
        }

        // Remove the reference mapping
        this.referenceMap.delete(refName);
    }

    // Access checks
    private checkReadAccess(varName: string): void {
        console.log(`[COMPILE] Checking read access for ${varName}`);
        const state = this.lookupVariable(varName);

        if (!state) {
            throw new OwnershipError(`Variable ${varName} not declared`);
        }

        // First check ownership - has it been moved?
        if (state.state === BorrowState.Moved) {
            throw new OwnershipError(`Cannot use ${varName} after it has been moved`);
        }

        // Then check borrowing rules
        if (state.state === BorrowState.BorrowedMutably && !this.referenceMap.has(varName)) {
            throw new BorrowError(`Cannot read ${varName} while it is mutably borrowed`);
        }

        console.log(`[COMPILE] Variable ${varName} has read access, state=${BorrowState[state.state]}`);
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

    private checkArgAccess(varName: string): void {
        const state = this.lookupVariable(varName);

        if (!state) {
            throw new OwnershipError(`Variable ${varName} not declared`);
        }

        // Check if the variable has been moved
        if (state.state === BorrowState.Moved) {
            throw new OwnershipError(`Cannot use ${varName} after it has been moved`);
        }

        // Check if the variable is borrowed
        if (state.borrowers.length > 0) {
            throw new BorrowError(`Cannot use ${varName} while it is borrowed`);
        }
    }

    private isMutableReference(refName: string): boolean {
        const targetName = this.referenceMap.get(refName);
        if (targetName === undefined) return false;

        // Check if the target is a reference parameter
        if (targetName == null && this.currentFunction) return true;

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
        if (expr instanceof rp.IntContext) {
            return new Type(Primitive.i32);
        } else if (expr instanceof rp.BoolContext) {
            return new Type(Primitive.BOOL);
        } else if (expr instanceof rp.LogicalNotOpContext) {
            if (!this.getExpressionType(expr.expression()).equals(new Type(Primitive.BOOL))) {
                throw new Error(`Logical NOT operator expects a boolean expression`);
            }
            return new Type(Primitive.BOOL);
        } else if (
            expr instanceof rp.LogicalAndOpContext ||
            expr instanceof rp.LogicalOrOpContext || expr instanceof rp.EqualityOpContext) {
            const leftType = this.getExpressionType(expr._left);
            const rightType = this.getExpressionType(expr._right);
            if (
                !leftType.equals(new Type(Primitive.BOOL)) ||
                !rightType.equals(new Type(Primitive.BOOL))
            ) {
                throw new Error(`Logical operator expects boolean expressions`);
            }
            return new Type(Primitive.BOOL);
        } else if (expr instanceof rp.UnaryOpContext) {
            if (!this.getExpressionType(expr.expression()).equals(new Type(Primitive.i32))) {
                throw new Error(`Unary operator expects an integer expression`);
            }
            return new Type(Primitive.i32);
        } else if (expr instanceof rp.AddSubOpContext ||
            expr instanceof rp.MulDivOpContext || expr instanceof rp.ComparatorOpContext
        ) {
            const leftType = this.getExpressionType(expr._left);
            const rightType = this.getExpressionType(expr._right);
            if (
                !leftType.equals(new Type(Primitive.i32)) ||
                !rightType.equals(new Type(Primitive.i32))
            ) {
                throw new Error(`Arithmetic operator expects integer expressions`);
            }
            return new Type(Primitive.i32);
        } else if (expr instanceof rp.ParenExprContext) {
            return this.getExpressionType(expr.expression());
        } else if (expr instanceof rp.IdentifierContext) {
            const varName = expr.getText();
            const state = this.lookupVariable(varName);

            if (!state) {
                throw new Error(`Variable ${varName} is not defined`);
            }

            console.log(`[TYPE CHECK] Variable ${varName} has ${state.typeInfo.baseType instanceof Type ? "referenced" : ""}type ${state.typeInfo.baseType}`);
            return state.typeInfo;
        } else if (expr instanceof rp.FunctionCallContext) {
            const funcName = expr.IDENTIFIER().getText();
            const funcDef = this.functionDefinitions.get(funcName);

            if (!funcDef) {
                throw new Error(`Function ${funcName} is not defined`);
            }

            return funcDef.declaredReturnType;
        } else if (expr instanceof rp.ReferenceExprContext) {
            return new Type(this.getExpressionType(expr._target), undefined, expr._mutFlag ? true : false);
        } else if (expr instanceof rp.DereferenceExprContext) {
            // Get the underlying type for dereferenced expressions
            const targetExpr = expr._target;
            const baseType = this.getExpressionType(targetExpr).baseType;
            if (baseType instanceof Type) {
                return baseType;
            } else {
                throw new Error(`Dereferencing non-reference type: ${baseType}`);
            }
        } else {
            throw new Error(`Unsupported expression type: ${expr.constructor.name}`);
        }
    }

    // Virtual machine interaction
    public runVM(): number | boolean {
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

    public compile(tree: any): void {
        // Reset state
        this.reset();
        this.vm.reset();

        // COMPILATION PHASE: Generate VM instructions
        this.visit(tree);

        // Mark the end of the program
        this.vm.pushInstruction(InstructionTag.DONE);
    }

    /**
     * Reset all state for a new evaluation
     */
    public reset(): void {
        // Clear variable tracking
        this.variableStates = new Map();
        this.referenceMap = new Map();

        // Reset scopes
        this.scopes = [];
        this.scopes.push(new Map());

        // Reset function tracking
        this.functionDefinitions = new Map();

        // Reset reference tracking
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

    visitVariableDeclaration(ctx: rp.VariableDeclarationContext): number {
        const varName = ctx._name.text;
        const isMutable = ctx._mutFlag ? true : false;

        // Parse the type information
        let typeInfo: Type;
        if (ctx.type()) {
            typeInfo = Type.fromTypeContext(ctx.type());
        } else {
            // TODO: Type inference
            typeInfo = new Type(Primitive.i32);
        }

        console.log(`[COMPILE] Declaring variable: ${varName}, mutable: ${isMutable}, type: ${typeInfo.toString()}`);

        // Check if the variable is already defined in current scope
        if (this.currentScope().has(varName)) {
            console.log(`[ERROR] Variable ${varName} already exists in current scope`);
            console.log(`[DEBUG] All variables in current scope: ${Array.from(this.currentScope().keys()).join(', ')}`);
            console.log(`[DEBUG] All tracked variables: ${Array.from(this.variableStates.keys()).join(', ')}`);
            throw new Error(`Variable ${varName} is already defined in current scope`);
        }

        // IMPORTANT: Check type compatibility BEFORE allocating or registering the variable
        if (ctx.expression()) {
            const expr = ctx.expression();
            const initType = this.getExpressionType(expr);
            console.log(`[COMPILE] Initializer type: ${initType.toString()}`);

            if (!new Type(initType).equals(typeInfo)) {
                throw new Error(`Type mismatch: cannot initialize ${varName}: ${typeInfo.toString()} with value of type ${initType}`);
            }
        }

        // Only AFTER type check passes, allocate memory for the variable
        const address = this.vm.allocateVariable();

        // Create a variable state
        const varState = new VariableState(isMutable, address, typeInfo);

        // Register the variable in the current scope
        this.variableStates.set(varName, varState);
        this.currentScope().set(varName, true);

        // If there's an initializer, compile it
        if (ctx.expression()) {
            const expr = ctx.expression();

            // Check type compatibility
            const initType = this.getExpressionType(expr);
            if (!new Type(initType).equals(typeInfo)) {
                throw new Error(`Type mismatch: cannot initialize ${varName}: ${typeInfo.toString()} with value of type ${initType}`);
            }

            // Check if it's a variable-to-variable assignment (potential move)
            if (expr instanceof rp.IdentifierContext) {
                const sourceVar = expr.getText();
                const sourceState = this.lookupVariable(sourceVar);

                if (sourceState && !sourceState.typeInfo.hasCopyTrait) {
                    console.log(`[COMPILE] Moving ${sourceVar} to ${varName}`);

                    // Check if the source has been moved
                    if (sourceState.state === BorrowState.Moved) {
                        throw new OwnershipError(`Cannot use ${sourceVar} after it has been moved`);
                    }

                    // Check if the source is borrowed
                    if (sourceState.borrowers.length > 0) {
                        throw new BorrowError(`Cannot move ${sourceVar} while it is borrowed`);
                    }

                    // Load from source variable
                    this.vm.pushInstruction(InstructionTag.LOAD, sourceState.address);

                    // Store to destination variable
                    this.vm.pushInstruction(InstructionTag.STORE, varState.address);

                    // Mark source as moved
                    sourceState.state = BorrowState.Moved;
                    console.log(`[COMPILE] Marked ${sourceVar} as moved (state=${BorrowState[sourceState.state]})`);

                    return 0;
                }
            }

            // Regular initialization (not a move or Copy type)
            this.visit(ctx.expression());
            const isBool = varState.typeInfo.baseType === Primitive.BOOL;
            this.vm.pushInstruction(InstructionTag.STORE, varState.address, isBool);
        }

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

        // Check if this is a variable-to-variable assignment (potential move)
        const expr = ctx.expression();
        const exprType = this.getExpressionType(expr);

        // Type check the assignment
        if (!new Type(exprType).equals(targetState.typeInfo)) {
            throw new Error(`Type mismatch: cannot assign value of type ${exprType} to variable ${target} of type ${targetState.typeInfo.toString()}`);
        }

        // Check if this is a variable-to-variable assignment (potential move)
        if (expr instanceof rp.IdentifierContext) {
            const sourceVar = expr.getText();
            const sourceState = this.lookupVariable(sourceVar);

            if (sourceState && !sourceState.typeInfo.hasCopyTrait) {
                console.log(`[COMPILE] Moving ${sourceVar} to ${target}`);

                // Check if the source has been moved
                if (sourceState.state === BorrowState.Moved) {
                    throw new OwnershipError(`Cannot use ${sourceVar} after it has been moved`);
                }

                if (sourceState.borrowers.length > 0) {
                    throw new BorrowError(`Cannot move ${sourceVar} while it is borrowed`);
                }

                // Load from source variable
                this.vm.pushInstruction(InstructionTag.LOAD, sourceState.address);
                this.vm.pushInstruction(InstructionTag.STORE, targetState.address);

                // Mark source as moved
                sourceState.state = BorrowState.Moved;
                console.log(`[COMPILE] Marked ${sourceVar} as MOVED (state=${BorrowState[sourceState.state]})`);

                return 0;
            }
        }

        // For non-variable expressions, evaluate normally
        this.visit(expr);
        const isBool = targetState.typeInfo.baseType === Primitive.BOOL;
        this.vm.pushInstruction(InstructionTag.STORE, targetState.address, isBool);

        return 0;
    }

    // Visit a parse tree produced by RustParser#referenceExpr
    visitReferenceExpr(ctx: rp.ReferenceExprContext): number {
        // Get the target variable name
        const target = ctx._target.getText();
        const mutable = ctx._mutFlag ? true : false;
        const refName = `ref_to_${target}_${Date.now()}`;

        // TODO: Add support for nested references
        // Check if the target variable exists
        const targetState = this.lookupVariable(target);
        if (!targetState) {
            throw new Error(`Cannot borrow undefined variable: ${target}`);
        }

        // Check borrowing rules
        if (mutable) {
            this.borrowMutably(target, refName);
        } else {
            this.borrowImmutably(target, refName);
        }

        // Create a unique name for the reference

        // Store the reference in memory
        // IMPORTANT: Store the ADDRESS of the variable, not its valueget's address
        // Load the address of the target variable
        const refAddr = this.vm.allocateVariable();
        this.vm.pushInstruction(InstructionTag.LDCN, targetState.address);
        this.vm.pushInstruction(InstructionTag.STORE, refAddr);
        this.vm.pushInstruction(InstructionTag.LOAD, refAddr);

        // Create a variable state for the reference
        const typeInfo = new Type(targetState.typeInfo, target, mutable);
        const refState = new VariableState(false, refAddr, typeInfo);

        // Record the reference in the current scope
        this.variableStates.set(refName, refState);
        this.currentScope().set(refName, true);

        console.log(`[BORROW] Created reference ${refName} to ${target}`);

        // Return the reference's address
        return refAddr;
    }

    // Visit a parse tree produced by RustParser#dereferenceExpr
    visitDereferenceExpr(ctx: rp.DereferenceExprContext): number {
        // First visit the target expression to get the reference
        this.visit(ctx._target);

        // TODO: Add support for nested dereferences
        // If the target is an identifier, check if it's a reference
        if (ctx._target instanceof rp.IdentifierContext) {
            const refName = ctx._target.getText();
            const refState = this.lookupVariable(refName);

            // Check if the variable exists and is a reference
            if (!refState) {
                throw new Error(`Variable ${refName} not found`);
            }

            // Get the target variable name from the reference map
            const target = this.referenceMap.has(refName);
            if (!target) {
                throw new Error(`Reference ${refName} doesn't point to any variable`);
            }

            // Then fetch the value at that address (dereference)
            this.vm.pushInstruction(InstructionTag.FETCH);

            return 0;
        }

        // For non-identifier targets, assume the stack already has the reference address
        this.vm.pushInstruction(InstructionTag.FETCH);

        return 0;
    }

    // Visit a parse tree produced by RustParser#dereferenceAssignment
    visitDereferenceAssignment(ctx: rp.DereferenceAssignmentContext): number {
        // Get the dereference expression and the value
        if (!ctx._target || !ctx._value) {
            throw new BorrowError("Invalid dereference assignment syntax");
        }

        // Type check
        const targetType = this.getExpressionType(ctx._target);
        const valueType = this.getExpressionType(ctx._value);
        if (!(targetType.baseType instanceof Type) || !valueType.equals(targetType.baseType)) {
            throw new Error(
                `Type mismatch in dereference assignment: ${targetType} vs ${valueType}`
            );
        }

        // Extract the reference name from the dereference expression
        let refName: string = ctx._target.getText();

        // Check if this variable is a reference
        if (!this.isReference(refName)) {
            throw new BorrowError(`${refName} is not a reference`);
        }

        // Get the target state
        const targetState = this.lookupVariable(refName);
        if (!targetState) {
            throw new BorrowError(`Target of reference ${refName} no longer exists`);
        }

        // Get the target variable name
        const target = this.referenceMap.has(refName);
        if (!target) {
            throw new BorrowError(`${refName} does not point to a valid variable`);
        }

        // Check if this is a mutable reference
        if (!this.isMutableReference(refName)) {
            throw new BorrowError(
                `Cannot assign through immutable reference ${refName}`
            );
        }

        // Evaluate the value expression
        this.visit(ctx._value);

        // Push instruction to store the new value at the target's address
        this.vm.pushInstruction(InstructionTag.LOAD, targetState.address);
        const isBool = valueType.baseType === Primitive.BOOL;
        this.vm.pushInstruction(InstructionTag.PUT, undefined, isBool);

        return 0;
    }

    // Visit a parse tree produced by RustParser#block
    visitBlock(ctx: rp.BlockContext): number {
        console.log(`[COMPILE] Code block`);

        this.enterScope();

        // Compile all statements in the block
        const statements = ctx.statement() || [];
        for (const statement of statements) {
            this.visit(statement);
        }

        // Compile the optional final expression (for implicit returns)
        if (ctx.expression && ctx.expression()) {
            const expr = ctx.expression();
            // this.visit(ctx.expression());
            const type = this.getExpressionType(ctx.expression());
            // Check the type of the last expression if function block
            if (this.currentFunction) {
                if (!type.equals(this.currentFunction.declaredReturnType)) {
                    throw new Error(
                        `Function return type mismatch: expected ${this.currentFunction.declaredReturnType}, got ${type}`
                    )
                }
                this.visit(expr);
                // Push the return value to the stack
                this.vm.pushInstruction(InstructionTag.RETURN);
                this.currentFunction.hasReturned = true;
            }

        }

        this.exitScope();
        return 0;
    }

    // Visit a parse tree produced by RustParser#returnStatement
    visitReturnStatement(ctx: rp.ReturnStatementContext): number {
        // Check if we're in a function
        if (!this.currentFunction) {
            throw new Error("Return statement outside of function");
        }


        // If there's an expression, evaluate it
        if (ctx.expression()) {
            const returnType = this.getExpressionType(ctx.expression());
            if (!returnType.equals(this.currentFunction.declaredReturnType)) {
                throw new Error(
                    `Function return type mismatch: expected ${this.currentFunction.declaredReturnType}, got ${returnType}`
                );
            }
            this.visit(ctx.expression());
        } else {
            // For void returns, push a dummy value
            this.vm.pushInstruction(InstructionTag.LDCN, 0);
        }

        // Return to the caller
        this.vm.pushInstruction(InstructionTag.RETURN);
        this.currentFunction.hasReturned = true;

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

        this.enterScope();
        // Push arguments onto the stack in the reverse order
        // For a function add(x, y), the stack will be: [y, x]
        for (let i = args.length - 1; i >= 0; i--) {
            const arg = args[i];
            const argType = this.getExpressionType(arg);
            const paramName = params[i]._name?.text;
            const paramType = funcDef.paramTypes.get(paramName);

            // Verify type compatibility
            if (!argType.equals(paramType)) {
                throw new Error(`Type mismatch in function call: Parameter ${params[i]} expects ${paramType} but got ${argType}`);
            }

            // Evaluate the argument and push it onto the stack
            this.visit(arg);
        }

        // Generate the function call instruction
        this.vm.pushInstruction(InstructionTag.CALL, funcDef.label);
        this.exitScope();

        return 0;
    }

    // Visit a parse tree produced by RustParser#functionDeclaration
    visitFunctionDeclaration(ctx: rp.FunctionDeclarationContext): number {
        if (!ctx._name || !ctx._name.text) {
            throw new Error("Function declaration must have a name");
        }

        const funcName = ctx._name.text;
        const params = ctx.paramList();
        const returnType = ctx._returnType
            ? Type.fromTypeContext(ctx._returnType)
            : new Type(Primitive.VOID);

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

        // Set current function context
        this.currentFunction = fnDef;

        // Enter a scope for the function
        this.enterScope();

        if (params) {
            // Create parameter variables in order
            for (const param of params.param()) {
                const paramName = param._name?.text;
                const paramType = param.type();
                if (!paramName || !paramType) {
                    throw new Error("Invalid parameter definition");
                }

                // Register parameter variables in the correct order
                const type = this.processParameter(paramName, paramType);
                fnDef.paramTypes.set(paramName, type);
            }
        }

        // Visit the function body
        this.visit(ctx._functionBody);

        // Ensure all paths have a return for non-void functions
        if (!fnDef.hasReturned && !returnType.equals(new Type(Primitive.VOID))) {
            throw new Error(`Function ${funcName} must return a value of type ${returnType}`);
        }

        // Add a default return for void functions or as a safety
        if (!fnDef.hasReturned) {
            this.vm.pushInstruction(InstructionTag.LDCN, 0); // Default return value
            this.vm.pushInstruction(InstructionTag.RETURN);
        }

        // Clean up the function's scope
        this.exitScope();
        this.currentFunction = null;
        // Add the end label for the function
        this.vm.addLabel(endOfFnLabel);

        return 0;
    }

    // Process parameters with runtime type checking
    private processParameter(
        paramName: string,
        paramType: rp.TypeContext,
    ): Type {
        // Extract TypeInfo from the parameter type context
        const typeInfo = Type.fromTypeContext(paramType);

        // Allocate memory for the parameter
        const addr = this.vm.allocateVariable();

        // Create a variable state with the proper type info
        const varState = new VariableState(typeInfo.isMutable, addr, typeInfo);
        this.variableStates.set(paramName, varState);
        this.currentScope().set(paramName, true);
        if (typeInfo.baseType instanceof Type) {
            this.referenceMap.set(paramName, null);
        }
        // Store the argument at the allocated address during the function call
        const isBool = typeInfo.baseType === Primitive.BOOL;
        this.vm.pushInstruction(InstructionTag.STORE, addr, isBool);

        return typeInfo;
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
        // Add safety check to ensure scopes array is never empty
        if (this.scopes.length === 0) {
            console.log("[WARNING] No scopes available, creating a new global scope");
            this.scopes.push(new Map());
        }
        return this.scopes[this.scopes.length - 1];
    }

    // Visit a parse tree produced by RustParser#int
    visitInt(ctx: rp.IntContext): number {
        const value = parseInt(ctx.INT().getText());
        console.log(`[COMPILE] Loading constant: ${value}`);
        this.vm.pushInstruction(InstructionTag.LDCN, value, false);  // Pass isBool flag
        return 0;
    }

    // Visit identifiers (variables)
    // Update visitIdentifier to check for moved variables
    visitIdentifier(ctx: rp.IdentifierContext): number {
        const name = ctx.getText();
        const state = this.lookupVariable(name);

        if (!state) {
            throw new Error(`Variable ${name} is not declared`);
        }

        // Verify the variable hasn't been moved
        console.log(`[DEBUG] Using variable ${name}, state=${BorrowState[state.state]}`);
        if (state.state === BorrowState.Moved) {
            throw new OwnershipError(`Use of moved value: ${name}`);
        }

        // Check borrowing rules
        this.checkReadAccess(name);

        // Load the value with type information
        const isBool = state.typeInfo.baseType === Primitive.BOOL;
        this.vm.pushInstruction(InstructionTag.LOAD, state.address, isBool);

        return 0;
    }

    visitAddSubOp(ctx: rp.AddSubOpContext): number {
        // Type check
        const leftType = this.getExpressionType(ctx._left)
        const rightType = this.getExpressionType(ctx._right)
        if (!leftType.equals(new Type(Primitive.i32)) || !rightType.equals(new Type(Primitive.i32))) {
            throw new Error(`Arithmetic operator expects integer expressions`);
        }

        // First visit the left operand
        this.visit(ctx._left);

        // Then visit the right operand
        this.visit(ctx._right);

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
        // Type check
        const leftType = this.getExpressionType(ctx._left)
        const rightType = this.getExpressionType(ctx._right)
        if (!leftType.equals(new Type(Primitive.i32)) || !rightType.equals(new Type(Primitive.i32))) {
            throw new Error(`Arithmetic operator expects integer expressions`);
        }
        // First visit the left operand
        this.visit(ctx._left);
        // Then visit the right operand
        this.visit(ctx._right);

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
        // Type check
        const exprType = this.getExpressionType(ctx.expression());
        if (!exprType.equals(new Type(Primitive.i32))) {
            throw new Error(`Unary operator expects integer expressions`);
        }

        // First, evaluate the expression being negated
        this.visit(ctx.expression());

        // Get the operator (should be '-')
        this.vm.pushInstruction(InstructionTag.NEG);
        console.log(`[COMPILE] Unary negation`);

        return 0;
    }

    // Visit a parse tree produced by RustParser#logicalNotOp
    visitLogicalNotOp(ctx: rp.LogicalNotOpContext): number {
        // Type check
        const exprType = this.getExpressionType(ctx.expression());
        if (!exprType.equals(new Type(Primitive.BOOL))) {
            throw new Error(`Logical NOT operator expects boolean expressions`);
        }
        // Evaluate the operand
        this.visit(ctx.expression());

        // Push the logical NOT instruction
        this.vm.pushInstruction(InstructionTag.NOT, undefined, true);
        console.log(`[COMPILE] Logical NOT operation`);

        return 0;
    }

    // Visit a parse tree produced by RustParser#logicalAndOp
    visitLogicalAndOp(ctx: rp.LogicalAndOpContext): number {
        // Type check
        const leftType = this.getExpressionType(ctx._left);
        const rightType = this.getExpressionType(ctx._right);
        if (!leftType.equals(new Type(Primitive.BOOL)) || !rightType.equals(new Type(Primitive.BOOL))) {
            throw new Error(`Logical AND operator expects boolean expressions`);
        }

        // Generate a short-circuit label
        const shortCircuitLabel = `and_short_circuit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const endLabel = `and_end_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Evaluate the left operand
        this.visit(ctx._left);

        // If left operand is false, short-circuit (result is false)
        this.vm.pushInstruction(InstructionTag.DUP); // Duplicate the value for the condition check
        this.vm.pushJof(shortCircuitLabel); // Jump if false

        // Evaluate the right operand
        this.visit(ctx._right);

        // Perform the AND operation
        this.vm.pushInstruction(InstructionTag.AND, undefined, true);
        this.vm.pushGoto(endLabel);

        // Short circuit: left was false, so result is false
        this.vm.addLabel(shortCircuitLabel);
        this.vm.pushInstruction(InstructionTag.POP); // Pop the duplicated value
        this.vm.pushInstruction(InstructionTag.LDCN, 0); // Push false

        // End label
        this.vm.addLabel(endLabel);

        console.log(`[COMPILE] Logical AND operation`);
        return 0;
    }

    // Visit a parse tree produced by RustParser#logicalOrOp
    visitLogicalOrOp(ctx: rp.LogicalOrOpContext): number {
        // Type check
        const leftType = this.getExpressionType(ctx._left);
        const rightType = this.getExpressionType(ctx._right);
        if (!leftType.equals(new Type(Primitive.BOOL)) || !rightType.equals(new Type(Primitive.BOOL))) {
            throw new Error(`Logical OR operator expects boolean expressions`);
        }
        // Generate a short-circuit label
        const shortCircuitLabel = `or_short_circuit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const endLabel = `or_end_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Evaluate the left operand
        this.visit(ctx._left);

        // If left operand is true, short-circuit (result is true)
        this.vm.pushInstruction(InstructionTag.DUP); // Duplicate the value for the condition check
        this.vm.pushJof(shortCircuitLabel); // Jump if not false (i.e., true)

        // Evaluate the right operand
        this.visit(ctx._right);

        // Perform the OR operation
        this.vm.pushInstruction(InstructionTag.OR, undefined, true);
        this.vm.pushGoto(endLabel);

        // Short circuit: left was true, so result is true
        this.vm.addLabel(shortCircuitLabel);
        this.vm.pushInstruction(InstructionTag.POP); // Pop the duplicated value
        this.vm.pushInstruction(InstructionTag.LDCN, 1); // Push true

        // End label
        this.vm.addLabel(endLabel);

        console.log(`[COMPILE] Logical OR operation`);
        return 0;
    }

    // Enhance boolean literal support
    visitBool(ctx: rp.BoolContext): number {
        const value = ctx.BOOL().getText() === "true" ? 1 : 0;
        console.log(`[COMPILE] Loading boolean constant: ${value === 1 ? 'true' : 'false'}`);
        this.vm.pushInstruction(InstructionTag.LDCN, value, true);  // Pass isBool flag
        return 0;
    }

    visitComparatorOp(ctx: rp.ComparatorOpContext): number {
        // Type check
        const leftType = this.getExpressionType(ctx._left)
        const rightType = this.getExpressionType(ctx._right)
        if (!leftType.equals(new Type(Primitive.i32)) || !rightType.equals(new Type(Primitive.i32))) {
            throw new Error(`Comparison operator expects integer expressions`);
        }

        // Now actually evaluate the expressions
        this.visit(ctx._left);
        this.visit(ctx._right);

        const op = ctx._op.text;
        console.log(`[COMPILE] Comparison operation: ${op}`);

        // Push the appropriate instruction
        switch (op) {
            case ">":
                this.vm.pushInstruction(InstructionTag.GT, undefined, true);
                break;
            case ">=":
                this.vm.pushInstruction(InstructionTag.GE, undefined, true);
                break;
            case "<":
                this.vm.pushInstruction(InstructionTag.LT, undefined, true);
                break;
            case "<=":
                this.vm.pushInstruction(InstructionTag.LE, undefined, true);
                break;
            default:
                throw new Error(`Unknown comparison operator: ${op}`);
        }

        return 0;
    }

    // Enhance visitEqualityOp for better type checking
    visitEqualityOp(ctx: rp.EqualityOpContext): number {
        // Type check
        const leftType = this.getExpressionType(ctx._left)
        const rightType = this.getExpressionType(ctx._right)
        if (!leftType.equals(new Type(Primitive.i32)) || !rightType.equals(new Type(Primitive.i32))) {
            throw new Error(`Equality operator expects integer expressions`);
        }

        // Now actually evaluate the expressions
        this.visit(ctx._left);
        this.visit(ctx._right);

        const op = ctx._op.text;
        console.log(`[COMPILE] Equality operation: ${op}`);
        // Push the appropriate instruction
        switch (op) {
            case "==":
                this.vm.pushInstruction(InstructionTag.EQ, undefined, true);
                break;
            case "!=":
                this.vm.pushInstruction(InstructionTag.NE, undefined, true);
                break;
            default:
                throw new Error(`Unknown comparison operator: ${op}`);
        }

        return 0;
    }

    public releaseAllResources(): void {
        console.log("[CLEANUP] Releasing all resources...");

        // Process each variable in variableStates
        for (const [varName, state] of this.variableStates.entries()) {
            // Check if the variable is in Owned state
            if (state.state === BorrowState.Owned) {
                console.log(`[CLEANUP] Releasing owned variable: ${varName}`);

                // Free the memory
                this.vm.pushInstruction(InstructionTag.FREE, state.address);

                // Mark as released for debugging
                state.state = BorrowState.Moved;
            }

            // Also clean up any references
            if (this.referenceMap.has(varName)) {
                console.log(`[CLEANUP] Releasing reference: ${varName}`);
                this.releaseBorrow(varName);
            }
        }

        console.log("[CLEANUP] All resources released");
    }

}

export class RustEvaluator extends BasicEvaluator {
    private executionCount: number;

    constructor(conductor: IRunnerPlugin) {
        super(conductor);
        this.executionCount = 0;
    }

    async evaluateChunk(chunk: string): Promise<void> {
        this.executionCount++;
        try {
            //console.log("[EVALUATOR] ======== STARTING NEW EVALUATION #" + this.executionCount + " ========");

            // Create completely new instances for each evaluation
            const vm = new VirtualMachine();
            const visitor = new RustEvaluatorVisitor(vm);

            // Reset all state
            vm.reset();
            visitor.reset();

            // Create parser and process input
            const inputStream = CharStream.fromString(chunk);
            const lexer = new RustLexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new rp.RustParser(tokenStream);

            // Parse the input
            const tree = parser.prog();

            // COMPILATION PHASE: Generate VM instructions
            visitor.visit(tree);

            // Check for a final standalone variable reference
            const lines = chunk.split('\n');
            const lastLine = lines[lines.length - 1].trim();
            const varMatch = lastLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*);?\s*(\/\/.*)?$/);
            if (varMatch) {
                const varName = varMatch[1];
                console.log(`[EVALUATOR] Final expression is variable: ${varName}`);
                const varState = visitor.lookupVariable(varName);
                if (varState) {
                    const isBool = varState.typeInfo.baseType === Primitive.BOOL;
                    vm.pushInstruction(InstructionTag.LOAD, varState.address, isBool);
                }
            }

            vm.pushInstruction(InstructionTag.DONE);
            // Print instructions for debugging
            vm.printInstructions();

            // EXECUTION PHASE: Run the VM code
            console.log("[EVALUATOR] Running compiled code...");
            const result = vm.run();

            // Send the result to the REPL
            this.conductor.sendOutput(`Result: ${result}`);
            console.log("[EVALUATOR] ======== EVALUATION COMPLETE ========");
        } catch (error) {
            if (error instanceof Error) {
                this.conductor.sendOutput(`Error: ${error.message}`);
                console.error(error.stack);
            } else {
                this.conductor.sendOutput(`Error: ${String(error)}`);
            }
        }
    }
}
