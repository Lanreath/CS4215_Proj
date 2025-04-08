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
    BOOL = "bool",
    REF = "ref",
    REF_MUT = "ref_mut",
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
    typeInfo: TypeInfo; // Type information for the variable
    //type: Type = Type.I64; // Default type
    borrowers: string[] = []; // Track which variables are borrowing this one

    constructor(mutable: boolean, address: number, typeInfo: TypeInfo) {
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
    isReference: boolean;
    isMutable: boolean;
    hasCopyTrait: boolean;

    constructor(baseType: Type, refTarget?: string, isReference: boolean = false, isMutable: boolean = false) {
        this.baseType = baseType;
        this.refTarget = refTarget;
        this.isReference = isReference;
        this.isMutable = isMutable;

        this.hasCopyTrait = false;
    }

    static fromTypeContext(ctx: rp.TypeContext): TypeInfo {
        const isRef = ctx._refFlag ? true : false;
        const isMutable = isRef && ctx._mutFlag ? true : false;

        if (isRef) {
            // Create a reference type
            return new TypeInfo(isMutable ? Type.REF_MUT : Type.REF, undefined, true, isMutable);
        } else {
            // Create a basic type
            const typeName = ctx.getText();
            if (typeName === "i64") {
                return new TypeInfo(Type.I64);
            } else if (typeName === "bool") {
                return new TypeInfo(Type.BOOL);
            } else {
                throw new Error(`Unsupported type: ${typeName}`);
            }
        }
    }

    toString(): string {
        if (this.isReference) {
            const mutPrefix = this.isMutable ? "mut " : "";
            return `&${mutPrefix}${this.refTarget || this.baseType}`;
        }
        return this.baseType.toString();
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
    public variableStates: Map<string, VariableState>;

    public getVariableStates(): Map<string, VariableState> {
        return this.variableStates;
    }
    public referenceMap: Map<string, string>; // Maps reference names to their target
    private functionDefinitions: Map<string, FunctionDefinition> = new Map();
    private isReturning: boolean = false;
    private currentFunctionReturnType: string | null = null;
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
        this.currentFunctionReturnType = null;
        this.isReturning = false;
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

            // Handle references
            if (this.referenceMap.has(name)) {
                this.releaseBorrow(name);
                this.referenceMap.delete(name);
            }

            // Get the state
            const state = this.variableStates.get(name);
            if (state) {
                // Free memory
                this.vm.pushInstruction(InstructionTag.FREE, state.address);
                // IMPORTANT: Remove from variable tracking
                this.variableStates.delete(name);
                console.log(`[DEBUG] Deleted variable: ${name}`);
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
        if (!targetVar) {
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
                if (borrowerState && borrowerState.typeInfo.baseType === Type.REF_MUT) {
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
        if (expr instanceof rp.IntContext) {
            return Type.I64;
        } else if (expr instanceof rp.BoolContext) {
            return Type.BOOL;
        } else if (expr instanceof rp.LogicalNotOpContext ||
            expr instanceof rp.LogicalAndOpContext ||
            expr instanceof rp.LogicalOrOpContext) {
            return Type.BOOL;
        } else if (expr instanceof rp.EqualityOpContext) {
            return Type.BOOL;
        } else if (expr instanceof rp.AddSubOpContext ||
            expr instanceof rp.MulDivOpContext ||
            expr instanceof rp.UnaryOpContext) {
            return Type.I64;
        } else if (expr instanceof rp.ParenExprContext) {
            return this.getExpressionType(expr.expression());
        } else if (expr instanceof rp.IdentifierContext) {
            const varName = expr.getText();
            const state = this.lookupVariable(varName);

            if (!state) {
                throw new Error(`Variable ${varName} is not defined`);
            }

            console.log(`[TYPE CHECK] Variable ${varName} has type ${state.typeInfo.baseType}`);
            return state.typeInfo.baseType;
        } else if (expr instanceof rp.FunctionCallContext) {
            const funcName = expr.IDENTIFIER().getText();
            const funcDef = this.functionDefinitions.get(funcName);

            if (!funcDef) {
                throw new Error(`Function ${funcName} is not defined`);
            }

            return funcDef.declaredReturnType;
        } else if (expr instanceof rp.ReferenceExprContext) {
            const targetExpr = expr._target;
            const targetType = this.getExpressionType(targetExpr);
            return expr._mutFlag ? Type.REF_MUT : Type.REF;
        } else if (expr instanceof rp.DereferenceExprContext) {
            // Get the underlying type for dereferenced expressions
            const targetExpr = expr._target;

            if (targetExpr instanceof rp.IdentifierContext) {
                const refName = targetExpr.getText();
                const refState = this.lookupVariable(refName);

                if (!refState) {
                    throw new Error(`Variable ${refName} is not defined`);
                }

                if (refState.typeInfo.baseType !== Type.REF && refState.typeInfo.baseType !== Type.REF_MUT) {
                    throw new Error(`Cannot dereference non-reference variable: ${refName}`);
                }

                // Look up the target variable to get its type
                const targetName = this.referenceMap.get(refName);
                if (!targetName) {
                    throw new Error(`Reference ${refName} does not point to a valid variable`);
                }

                const targetState = this.lookupVariable(targetName);
                return targetState.typeInfo.baseType;
            }

            return Type.I64; // Default for other cases
        } else {
            throw new Error(`Unsupported expression type: ${expr.constructor.name}`);
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
        this.currentFunctionReturnType = null;

        // Reset control flow flags
        this.isReturning = false;

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
        let typeInfo: TypeInfo;
        if (ctx.type()) {
            typeInfo = TypeInfo.fromTypeContext(ctx.type());
        } else {
            typeInfo = new TypeInfo(Type.I64);
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

            if (!this.checkTypeCompatibility(new TypeInfo(initType), typeInfo)) {
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
            if (!this.checkTypeCompatibility(new TypeInfo(initType), typeInfo)) {
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
            this.vm.pushInstruction(InstructionTag.STORE, varState.address);
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
        if (!this.checkTypeCompatibility(new TypeInfo(exprType), targetState.typeInfo)) {
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
        this.vm.pushInstruction(InstructionTag.STORE, targetState.address);

        return 0;
    }

    // Visit a parse tree produced by RustParser#referenceExpr
    visitReferenceExpr(ctx: rp.ReferenceExprContext): number {
        // Get the target variable name
        const target = ctx._target.getText();
        const mutable = ctx._mutFlag ? true : false;

        // Check if the target variable exists
        const targetState = this.lookupVariable(target);
        if (!targetState) {
            throw new Error(`Cannot borrow undefined variable: ${target}`);
        }

        // Check borrowing rules
        if (mutable) {
            this.borrowMutably(target, `ref_to_${target}_${Date.now()}`);
        } else {
            this.borrowImmutably(target, `ref_to_${target}_${Date.now()}`);
        }

        // Create a unique name for the reference
        const refName = `ref_to_${target}_${Date.now()}`;

        // Store the reference in memory
        // IMPORTANT: Store the ADDRESS of the variable, not its valueget's address
        const refAddr = this.vm.allocateVariable();
        this.vm.pushInstruction(InstructionTag.LDCN, targetState.address);
        this.vm.pushInstruction(InstructionTag.STORE, refAddr);

        // Create a variable state for the reference
        const typeInfo = new TypeInfo(mutable ? Type.REF_MUT : Type.REF, target);
        const refState = new VariableState(false, refAddr, typeInfo);

        // Record the reference in the current scope
        this.variableStates.set(refName, refState);
        this.currentScope().set(refName, true);

        // Record the reference relationship
        this.referenceMap.set(refName, target);

        console.log(`[BORROW] Created reference ${refName} to ${target}`);

        // Return the reference's address
        return refAddr;
    }

    // Visit a parse tree produced by RustParser#dereferenceExpr
    visitDereferenceExpr(ctx: rp.DereferenceExprContext): number {
        // First visit the target expression to get the reference
        const refAddr = this.visit(ctx._target);

        // If the target is an identifier, check if it's a reference
        if (ctx._target instanceof rp.IdentifierContext) {
            const refName = ctx._target.getText();
            const refState = this.lookupVariable(refName);

            // Check if the variable exists and is a reference
            if (!refState) {
                throw new Error(`Variable ${refName} not found`);
            }

            if (refState.typeInfo.baseType !== Type.REF && refState.typeInfo.baseType !== Type.REF_MUT) {
                throw new BorrowError(`${refName} is not a reference`);
            }

            // Get the target variable name from the reference map
            const targetName = this.referenceMap.get(refName);
            if (!targetName) {
                throw new Error(`Reference ${refName} doesn't point to any variable`);
            }

            // Get the target variable's address
            const targetState = this.lookupVariable(targetName);
            if (!targetState) {
                throw new Error(`Target variable ${targetName} not found`);
            }

            // Load the address the reference points to
            this.vm.pushInstruction(InstructionTag.LOAD, refState.address);

            // Then fetch the value at that address (dereference)
            this.vm.pushInstruction(InstructionTag.FETCH);

            console.log(`[BORROW] Dereferenced ${refName} to access ${targetName}`);

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
        this.vm.pushInstruction(InstructionTag.LDCN, value);
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

        // Load the value
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

    private assignVariable(name: string, valueType: TypeInfo): void {
        const state = this.lookupVariable(name);
        if (!state) {
            throw new Error(`Variable ${name} is not declared`);
        }
        if (!state.mutable) {
            throw new Error(`Cannot assign to immutable variable ${name}`);
        }
        if (state.state === BorrowState.Moved) {
            throw new Error(`Cannot assign to ${name} because it has been moved`);
        }
        if (state.state === BorrowState.BorrowedMutably) {
            throw new Error(`Cannot assign to ${name} because it is mutably borrowed`);
        }
        if (!this.checkTypeCompatibility(state.typeInfo, valueType)) {
            throw new Error(`Type mismatch: expected ${state.typeInfo}, got ${valueType}`);
        }
        console.log(`[STATIC CHECK] Assigned value to variable: ${name}`);
    }

    private checkTypeCompatibility(actual: TypeInfo, expected: TypeInfo): boolean {
        console.log(`[TYPE CHECK] Checking compatibility between ${actual.toString()} and ${expected.toString()}`);

        // Basic case: exact type match
        if (actual.baseType === expected.baseType) {
            return true;
        }

        // Special case for literals
        if (actual.baseType === Type.I64 && expected.baseType === Type.I64) {
            return true;
        }

        if (actual.baseType === Type.BOOL && expected.baseType === Type.BOOL) {
            return true;
        }

        // Reference compatibility rules
        if ((actual.baseType === Type.REF || actual.baseType === Type.REF_MUT) &&
            (expected.baseType === Type.REF || expected.baseType === Type.REF_MUT)) {

            // Immutable references can be passed to immutable reference parameters
            if (actual.baseType === Type.REF && expected.baseType === Type.REF) {
                return true;
            }

            // Mutable references can be passed to immutable reference parameters
            if (actual.baseType === Type.REF_MUT && expected.baseType === Type.REF) {
                return true;
            }

            // Mutable references can only be passed to mutable reference parameters
            if (actual.baseType === Type.REF_MUT && expected.baseType === Type.REF_MUT) {
                return true;
            }
        }

        console.log(`[TYPE CHECK] Types are not compatible`);
        return false;
    }

    // Visit a parse tree produced by RustParser#logicalNotOp
    visitLogicalNotOp(ctx: rp.LogicalNotOpContext): number {
        // Evaluate the operand
        this.visit(ctx.expression());

        // Check the operand's type
        const operandType = this.getExpressionType(ctx.expression());
        if (operandType !== Type.BOOL) {
            throw new Error(`Logical NOT (!) can only be applied to boolean values, got ${operandType}`);
        }

        // Push the logical NOT instruction
        this.vm.pushInstruction(InstructionTag.NOT);
        console.log(`[COMPILE] Logical NOT operation`);

        return 0;
    }

    // Visit a parse tree produced by RustParser#logicalAndOp
    visitLogicalAndOp(ctx: rp.LogicalAndOpContext): number {
        // Check types first
        const leftType = this.getExpressionType(ctx.expression(0));
        const rightType = this.getExpressionType(ctx.expression(1));

        if (leftType !== Type.BOOL || rightType !== Type.BOOL) {
            throw new Error(`Logical AND (&&) requires boolean operands, got ${leftType} && ${rightType}`);
        }

        // Generate a short-circuit label
        const shortCircuitLabel = `and_short_circuit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const endLabel = `and_end_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Evaluate the left operand
        this.visit(ctx.expression(0));

        // If left operand is false, short-circuit (result is false)
        this.vm.pushInstruction(InstructionTag.DUP); // Duplicate the value for the condition check
        this.vm.pushJof(shortCircuitLabel); // Jump if false

        // Evaluate the right operand
        this.visit(ctx.expression(1));

        // Perform the AND operation
        this.vm.pushInstruction(InstructionTag.AND);
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
        // Check operand types first
        const leftType = this.getExpressionType(ctx.expression(0));
        const rightType = this.getExpressionType(ctx.expression(1));

        if (leftType !== Type.BOOL || rightType !== Type.BOOL) {
            throw new Error(`Logical OR (||) requires boolean operands, got ${leftType} || ${rightType}`);
        }

        // Generate a short-circuit label
        const shortCircuitLabel = `or_short_circuit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const endLabel = `or_end_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Evaluate the left operand
        this.visit(ctx.expression(0));

        // If left operand is true, short-circuit (result is true)
        this.vm.pushInstruction(InstructionTag.DUP); // Duplicate the value for the condition check
        this.vm.pushJof(shortCircuitLabel); // Jump if not false (i.e., true)

        // Evaluate the right operand
        this.visit(ctx.expression(1));

        // Perform the OR operation
        this.vm.pushInstruction(InstructionTag.OR);
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
        this.vm.pushInstruction(InstructionTag.LDCN, value);
        return 0;
    }

    // Enhance visitEqualityOp for better type checking
    visitEqualityOp(ctx: rp.EqualityOpContext): number {
        // Evaluate the left and right expressions
        const leftType = this.getExpressionType(ctx.expression(0));
        const rightType = this.getExpressionType(ctx.expression(1));

        // Type checking - both operands must be of the same type for comparison
        if (leftType !== rightType) {
            throw new Error(`Type mismatch in comparison: cannot compare ${leftType} with ${rightType}`);
        }

        // Only numeric and boolean types can be compared
        if (leftType !== Type.I64 && leftType !== Type.BOOL) {
            throw new Error(`Invalid operand types for comparison: ${leftType}`);
        }

        // Now actually evaluate the expressions
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
            vm.pushInstruction(InstructionTag.DONE);

            // Check for a final standalone variable reference
            const lines = chunk.split('\n');
            const lastLine = lines[lines.length - 1].trim();
            const varMatch = lastLine.match(/^([a-zA-Z_][a-zA-Z0-9_]*);?\s*(\/\/.*)?$/);
            if (varMatch) {
                const varName = varMatch[1];
                console.log(`[EVALUATOR] Final expression is variable: ${varName}`);
                const varState = visitor.lookupVariable(varName);
                if (varState) {
                    vm.pushInstruction(InstructionTag.LOAD, varState.address);
                }
            }

            // Print instructions for debugging
            vm.printInstructions();

            // EXECUTION PHASE: Run the VM code
            console.log("[EVALUATOR] Running compiled code...");
            const result = vm.run();

            // Send the result to the REPL
            this.conductor.sendOutput(`Result: ${result}`);
            visitor.releaseAllResources();
            visitor.variableStates = new Map();
            visitor.scopes = [new Map()];
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
