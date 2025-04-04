import { TypeInfo, Type } from "./RustEvaluator";

export enum InstructionTag {
    DONE = "DONE",
    LDCN = "LDCN",
    PLUS = "PLUS",
    MINUS = "MINUS",
    TIMES = "TIMES",
    DIVIDE = "DIVIDE",
    LT = "LT",
    LE = "LE",
    GT = "GT",
    GE = "GE",
    EQ = "EQ",
    NE = "NE",
    GOTO = "GOTO",
    JOF = "JOF",
    LOAD = "LOAD",
    STORE = "STORE",
    LOADADDR = "LOADADDR",
    FETCH = "FETCH",
    FREE = "FREE",
    CALL = "CALL",
    RETURN = "RETURN",
    STORE_WITH_TYPE = "STORE_WITH_TYPE", // Store with type checking
    CHECK_TYPE = "CHECK_TYPE",           // Check type compatibility
    PUSH_TYPE = "PUSH_TYPE",             // Push a type descriptor
    RET = "RET",                         // Return from a function
    STOREREF = "STOREREF",               // Store a value through a reference
    NEG = "NEG",                   // Negate a value
    AND = "AND",                   // Logical AND
    OR = "OR",                     // Logical OR
    NOT = "NOT",                   // Logical NOT
    DUP = "DUP",                   // Duplicate the top value on the stack
    POP = "POP",                   // Pop the top value from the stack
    JNOF = "JNOF",                 // Jump if not zero
}
export class Instruction {
    public tag: InstructionTag;
    public value?: number;
    public first?: number;
    public second?: number;

    constructor(
        tag: InstructionTag,
        value?: number,
        first?: number,
        second?: number
    ) {
        this.tag = tag;
        this.value = value;
        this.first = first;
        this.second = second;
    }

    public toString(): string {
        return `${this.tag} ${this.value ? this.value : this.value === 0 ? 0 : ""}`;
    }
}
export class VirtualMachine {
    private memory: ArrayBuffer;
    private view: DataView;
    private memSize: number;

    // Label support for VM jumps
    private labels: Map<string, number> = new Map();
    private forwardRefs: Map<string, number[]> = new Map();

    private static readonly OS_BASE = 0;
    private static readonly RT_BASE = 512
    private static readonly RS_BASE = 1024

    private ic: number = 0; // Instruction counter
    private instructions: Instruction[] = [];
    private pc: number = 0; // Program counter
    private osPtr: number = 0; // Operand stack pointer
    private rtPtr: number = 0; // Return stack pointer
    private rsPtr: number = 0; // Runtime stack pointer

    private valueTypes: Map<number, TypeInfo> = new Map();

    private returnStack: number[] = [];

    constructor(memSize: number = 4096) {
        // Ensure this is large enough
        this.memSize = memSize;
        this.memory = new ArrayBuffer(memSize);
        this.view = new DataView(this.memory);
    }

    private pushOperand(value: number): void {
        const addr = VirtualMachine.OS_BASE + this.osPtr * 4;
        if (addr >= VirtualMachine.RT_BASE) {
            throw new Error("Operand stack overflow");
        }
        this.view.setInt32(addr, value);
        this.osPtr++;
    }

    private popOperand(): number {
        if (this.osPtr <= 0) {
            throw new Error("Operand stack underflow");
        }
        this.osPtr--;
        const addr = VirtualMachine.OS_BASE + this.osPtr * 4;
        const value = this.view.getInt32(addr);
        this.view.setInt32(addr, 0);
        return value;
    }

    private peekOperand(): number {
        if (this.osPtr <= 0) {
            throw new Error("Operand stack underflow");
        }
        const addr = VirtualMachine.OS_BASE + (this.osPtr - 1) * 4;
        return this.view.getInt32(addr);
    }

    private pushReturn(addr: number): void {
        if (this.returnStack.length >= 100) {
            throw new Error("Call stack overflow");
        }
        this.returnStack.push(addr);
        console.log(`[VM] Pushed return address ${addr} to call stack`);
    }

    private popReturn(): number {
        if (this.returnStack.length === 0) {
            throw new Error("Call stack underflow - trying to return without a call");
        }
        const addr = this.returnStack.pop();
        console.log(`[VM] Popped return address ${addr} from call stack`);
        return addr;
    }

    // private pushReturn(value: number): void {
    //     const addr = VirtualMachine.RT_BASE + this.rtPtr * 4;
    //     if (addr >= VirtualMachine.RS_BASE) {
    //         throw new Error("Return stack overflow");
    //     }
    //     this.view.setInt32(addr, value);
    //     this.rtPtr++;
    // }

    // private popReturn(): number {
    //     if (this.rtPtr <= 0) {
    //         throw new Error("Return stack underflow");
    //     }
    //     this.rtPtr--;
    //     const addr = VirtualMachine.RT_BASE + this.rtPtr * 4;
    //     const value = this.view.getInt32(addr);
    //     this.view.setInt32(addr, 0);
    //     return value;
    // }

    private load(addr: number): number {
        const heapAddr = VirtualMachine.RS_BASE + addr;
        if (heapAddr < VirtualMachine.RS_BASE || heapAddr >= this.memSize) {
            throw new Error(`Invalid memory address for load: ${addr}`);
        }
        const value = this.view.getInt32(heapAddr);
        if (isNaN(value)) {
            throw new Error(`Invalid value at address ${addr}`);
        }
        return value;
    }

    private store(addr: number, value: number): void {
        const heapAddr = VirtualMachine.RS_BASE + addr;
        if (heapAddr < VirtualMachine.RS_BASE || heapAddr >= this.memSize) {
            throw new Error(`Invalid memory address for store: ${addr}`);
        }
        this.view.setInt32(heapAddr, value);
    }

    private popTwoOperands(): [number, number] {
        if (this.osPtr < 2) {
            throw new Error("Not enough operands for binary operation");
        }

        const b = this.popOperand();
        const a = this.popOperand();
        return [a, b];
    }
    public getInstructionCounter(): number {
        return this.ic;
    }

    // Enhanced instruction printing
    public printInstructions(): void {
        console.log("Program instructions:");
        if (this.instructions.length === 0) {
            console.log("  No instructions generated!");
        }

        for (let i = 0; i < this.instructions.length; i++) {
            const instr = this.instructions[i];
            if (!instr) {
                console.log(`${i}: <null instruction>`);
                continue;
            }

            let instrStr = `${i}: ${instr.tag}`;
            if (instr.value !== undefined) {
                instrStr += ` ${instr.value}`;
            }
            console.log(instrStr);
        }
    }

    public pushInstruction(tag: InstructionTag, value?: number): number {
        console.log(
            `[VM] Pushing instruction: ${tag}${value !== undefined ? " " + value : ""
            }`
        );
        const instr = new Instruction(tag, value);
        this.instructions[this.ic] = instr;
        return ++this.ic;
    }

    public setInstructionTarget(
        instructionIndex: number,
        targetIndex: number
    ): void {
        if (instructionIndex < 0 || instructionIndex >= this.ic) {
            throw new Error("Invalid instruction index");
        }
        if (targetIndex < 0 || targetIndex > this.ic) {
            throw new Error("Invalid target index");
        }
        if (
            this.instructions[instructionIndex].tag !== InstructionTag.GOTO &&
            this.instructions[instructionIndex].tag !== InstructionTag.JOF
        ) {
            console.log(this.instructions[instructionIndex]);
            throw new Error("Invalid instruction for target");
        }
        this.instructions[instructionIndex].value = targetIndex;
    }

    // Add a label at the current instruction counter
    public addLabel(label: string): void {
        console.log(`[VM] Adding label '${label}' at instruction ${this.ic}`);
        this.labels.set(label, this.ic);

        // Resolve any forward references to this label
        if (this.forwardRefs.has(label)) {
            const refs = this.forwardRefs.get(label)!;
            console.log(
                `[VM] Resolving ${refs.length} forward references to label '${label}'`
            );

            for (const instructionIndex of refs) {
                this.setInstructionTarget(instructionIndex, this.ic);
                console.log(
                    `[VM] Resolved jump at instruction ${instructionIndex} to target ${this.ic}`
                );
            }

            // Clear the resolved references
            this.forwardRefs.delete(label);
        }
    }
    // Push a goto instruction that will be resolved later
    public pushGoto(label: string): number {
        console.log(`[VM] Pushing GOTO to '${label}'`);
        const idx = this.pushInstruction(InstructionTag.GOTO);

        // If the label already exists, set the target
        if (this.labels.has(label)) {
            this.setInstructionTarget(idx - 1, this.labels.get(label)!);
        } else {
            if (!this.forwardRefs.has(label)) {
                this.forwardRefs.set(label, []);
            }
            this.forwardRefs.get(label)!.push(idx - 1);
            console.log(
                `[VM] Added forward reference to label '${label}' from instruction ${idx - 1
                }`
            );
        }

        return idx;
    }

    // Push a jump-on-false instruction that will be resolved later
    public pushJof(label: string): number {
        console.log(`[VM] Pushing JOF to '${label}'`);
        const idx = this.pushInstruction(InstructionTag.JOF);

        // If the label already exists, set the target
        if (this.labels.has(label)) {
            this.setInstructionTarget(idx - 1, this.labels.get(label)!);
        } else {
            if (!this.forwardRefs.has(label)) {
                this.forwardRefs.set(label, []);
            }
            this.forwardRefs.get(label)!.push(idx - 1);
            console.log(
                `[VM] Added forward reference to label '${label}' from instruction ${idx - 1
                }`
            );
        }

        return idx;
    }


    public free(addr: number): void {
        const heapAddr = VirtualMachine.RS_BASE + addr;
        if (heapAddr < VirtualMachine.RS_BASE || heapAddr >= this.memSize) {
            throw new Error(`Invalid memory address for free: ${addr}`);
        }
        this.view.setInt32(heapAddr, 0);
    }

    public allocateVariable(): number {
        const addr = this.rsPtr;
        if (VirtualMachine.RS_BASE + addr >= this.memSize) {
            throw new Error("Runtime stack overflow");
        }
        this.rsPtr += 4; // Allocate 4 bytes for an integer
        return addr;
    }

    public run(): number {
        this.pc = 0;
        this.osPtr = 0; // Reset operand stack pointer
        let a: number;
        let b: number;
        try {
            while (this.pc < this.ic) {
                const instr = this.instructions[this.pc++];

                if (!instr) {
                    throw new Error(`Invalid instruction at ${this.pc - 1}`);
                }

                // Debug instruction execution
                console.log(
                    `[VM] Executing: ${instr.tag}${instr.value !== undefined ? " " + instr.value : ""
                    }`
                );

                switch (instr.tag) {
                    case InstructionTag.DONE:
                        // Return the top value from the stack
                        return this.osPtr > 0 ? this.popOperand() : 0;
                    case InstructionTag.LDCN:
                        if (instr.value !== undefined) {
                            this.pushOperand(instr.value);
                        } else {
                            console.warn(`LDCN with undefined value at ${this.pc - 1}`);
                            this.pushOperand(0);
                        }
                        break;
                    case InstructionTag.PLUS: {
                        const [a, b] = this.popTwoOperands();
                        const result = a + b;
                        console.log(`[VM] PLUS: ${a} + ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.MINUS: {
                        const [a, b] = this.popTwoOperands();
                        const result = a - b;
                        console.log(`[VM] MINUS: ${a} - ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }

                    case InstructionTag.TIMES: {
                        const [a, b] = this.popTwoOperands();
                        const result = a * b;
                        console.log(`[VM] TIMES: ${a} * ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.DIVIDE: {
                        const [a, b] = this.popTwoOperands();

                        if (b === 0) {
                            throw new Error("Division by zero");
                        }

                        // Integer division truncates toward zero in Rust
                        const result = Math.trunc(a / b);
                        console.log(`[VM] DIVIDE: ${a} / ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.LT: {
                        const [a, b] = this.popTwoOperands();
                        const result = a < b ? 1 : 0;
                        console.log(`[VM] LT: ${a} < ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.LE: {
                        const [a, b] = this.popTwoOperands();
                        const result = a <= b ? 1 : 0;
                        console.log(`[VM] LE: ${a} <= ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.GT: {
                        const [a, b] = this.popTwoOperands();
                        const result = a > b ? 1 : 0;
                        console.log(`[VM] GT: ${a} > ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.GE: {
                        const [a, b] = this.popTwoOperands();
                        const result = a >= b ? 1 : 0;
                        console.log(`[VM] GE: ${a} >= ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.EQ: {
                        const [a, b] = this.popTwoOperands();
                        const result = a === b ? 1 : 0;
                        console.log(`[VM] EQ: ${a} == ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.NE: {
                        const [a, b] = this.popTwoOperands();
                        const result = a !== b ? 1 : 0;
                        console.log(`[VM] NE: ${a} != ${b} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    case InstructionTag.GOTO: {
                        if (instr.value === undefined) {
                            throw new Error("GOTO instruction missing target");
                        }
                        console.log(`[VM] GOTO: Jumping to ${instr.value}`);
                        this.pc = instr.value;
                        break;
                    }
                    case InstructionTag.JOF: {
                        if (instr.value === undefined) {
                            throw new Error("JOF instruction missing target");
                        }

                        const condition = this.popOperand();
                        // Jump if the condition is false (0)
                        if (condition === 0) {
                            console.log(
                                `[VM] JOF: Condition false, jumping to ${instr.value}`
                            );
                            this.pc = instr.value;
                        } else {
                            console.log(`[VM] JOF: Condition true, continuing`);
                        }
                        break;
                    }
                    case InstructionTag.LOAD: {
                        if (instr.value === undefined) {
                            throw new Error("LOAD instruction missing address");
                        }
                        const value = this.load(instr.value);
                        console.log(`[VM] LOAD: Loaded value at ${instr.value}: ${value}`);
                        this.pushOperand(value);
                        break;
                    }
                    case InstructionTag.STORE: {
                        if (instr.value === undefined) {
                            throw new Error("STORE instruction missing address");
                        }
                        const value = this.popOperand();
                        console.log(
                            `[VM] STORE: Storing ${value} at address ${instr.value}`
                        );
                        this.store(instr.value, value);
                        break;
                    }
                    case InstructionTag.LOADADDR: {
                        if (instr.value === undefined) {
                            throw new Error("LOADADDR instruction missing address");
                        }
                        
                        // Push the address itself onto the stack, not the value
                        this.pushOperand(instr.value);
                        console.log(`[VM] LOADADDR: Pushed address ${instr.value} onto stack`);
                        break;
                    }
                    case InstructionTag.FETCH: {
                        // Pop an address from the stack
                        const addr = this.popOperand();
                        
                        // Load the value at that address
                        const value = this.load(addr);
                        
                        // Push the value onto the stack
                        this.pushOperand(value);
                        console.log(`[VM] FETCH: Loaded ${value} from address ${addr}`);
                        break;
                    }
                    case InstructionTag.FREE: {
                        // Mark memory as available for reuse
                        if (instr.value !== undefined) {
                            console.log(`[VM] FREE: Releasing memory at address ${instr.value}`);
                            // Add memory management code here
                        }
                        break;
                    }
                    case InstructionTag.CALL: {
                        if (instr.value === undefined) {
                            throw new Error("CALL instruction missing address");
                        }
                        console.log(`[VM] CALL: Calling function at ${instr.value}`);
                        // Store the address of the next instruction to return to
                        this.pushReturn(this.pc + 1); 
                        this.pc = instr.value;
                        break;
                    }
                    case InstructionTag.RETURN: {
                        const returnAddr = this.popReturn();
                        console.log(`[VM] RETURN: Returning to ${returnAddr}`);
                        this.pc = returnAddr;
                        break;
                    }
                    case InstructionTag.STORE_WITH_TYPE: {
                        if (instr.value === undefined) {
                            throw new Error("STORE_WITH_TYPE instruction missing address");
                        }
                        
                        // Get the value and expected type
                        const value = this.popOperand();
                        const expectedType = this.instructions.shift()?.value as unknown as TypeInfo;
                        
                        if (!expectedType) {
                            throw new Error("STORE_WITH_TYPE missing type information");
                        }
                        
                        // Determine the actual type of the value
                        let actualType: TypeInfo;
                        if (Number.isInteger(value)) {
                            actualType = new TypeInfo(Type.I64);
                        } else {
                            // Default to i64 for other values
                            actualType = new TypeInfo(Type.I64);
                        }
                        
                        // Check type compatibility
                        if (!this.checkTypeCompatibility(actualType, expectedType)) {
                            throw new Error(`Type mismatch: expected ${expectedType.toString()}, got ${actualType.toString()}`);
                        }
                        
                        // Store the value with its type
                        this.storeValue(instr.value, value, expectedType);
                        break;
                    }
                    
                    case InstructionTag.CHECK_TYPE: {
                        // Get the value and expected type
                        const value = this.peekOperand(); // Peek, don't pop
                        const expectedType = this.instructions.shift()?.value as unknown as TypeInfo;
                        
                        if (!expectedType) {
                            throw new Error("CHECK_TYPE missing type information");
                        }
                        
                        // Determine the actual type of the value
                        let actualType: TypeInfo;
                        if (Number.isInteger(value)) {
                            actualType = new TypeInfo(Type.I64);
                        } else {
                            // Default to i64 for other values
                            actualType = new TypeInfo(Type.I64);
                        }
                        
                        // Check type compatibility
                        if (!this.checkTypeCompatibility(actualType, expectedType)) {
                            throw new Error(`Type mismatch: expected ${expectedType.toString()}, got ${actualType.toString()}`);
                        }
                        
                        break;
                    }
                    
                    case InstructionTag.PUSH_TYPE: {
                        // This instruction just puts a type onto the instruction queue
                        // It's handled by STORE_WITH_TYPE and CHECK_TYPE
                        break;
                    }
                    case InstructionTag.STOREREF: {
                        // Pop the value and the address from the stack
                        const value = this.popOperand();
                        const addr = this.popOperand();
                        
                        // Store the value at the address
                        this.store(addr, value);
                        console.log(`[VM] STOREREF: Stored ${value} at address ${addr}`);
                        break;
                    }

                    case InstructionTag.NEG: {
                        if (this.osPtr <= 0) {
                            throw new Error("Not enough operands for negation");
                        }
                        
                        const value = this.popOperand();
                        const result = -value;
                        console.log(`[VM] NEG: -${value} = ${result}`);
                        this.pushOperand(result);
                        break;
                    }
                    
                    case InstructionTag.CHECK_TYPE: {
                        // This instruction should have nothing because type check is trivial
                        console.log(`[VM] CHECK_TYPE: Type check passed`);
                        break;
                    }
                    
                    case InstructionTag.PUSH_TYPE: {
                        // This instruction should have nothing because type check is trivial
                        console.log(`[VM] PUSH_TYPE: Type ${instr.value} recorded`);
                        break;
                    }
                    case InstructionTag.AND:
                        a = this.popOperand();
                        b = this.popOperand();
                        this.pushOperand(a !== 0 && b !== 0 ? 1 : 0);
                        break;
                    case InstructionTag.OR:
                        a = this.popOperand();
                        b = this.popOperand();
                        this.pushOperand(a !== 0 || b !== 0 ? 1 : 0);
                        break;
                    case InstructionTag.NOT:
                        a = this.popOperand();
                        this.pushOperand(a === 0 ? 1 : 0);
                        break;
                    case InstructionTag.DUP:
                        a = this.popOperand();
                        this.pushOperand(a);
                        this.pushOperand(a);
                        break;
                    case InstructionTag.POP:
                        this.popOperand();
                        break;
                    case InstructionTag.JNOF:
                        a = this.popOperand();
                        if (a !== 0) {
                            this.pc = instr.value;
                        }
                        break;
                    default:
                        console.warn(`Unknown instruction: ${instr.tag}`);
                }
            }
            // No DONE instruction found
            return this.osPtr > 0 ? this.popOperand() : 0;
        } catch (error) {
            console.error("VM runtime error:", error);
            throw error;
        }
    }

    public loadValue(addr: number): number {
        // Safety check to prevent out-of-bounds reads
        if (addr < 0 || addr + 4 > this.memSize) {
            throw new Error(`Invalid memory address for read: ${addr}`);
        }

        return this.view.getInt32(addr, true);
    }

    public reset(): void {
        this.ic = 0;
        this.pc = 0;
        this.osPtr = VirtualMachine.OS_BASE;
        this.instructions = [];
        this.rsPtr = VirtualMachine.RS_BASE;

        // Clear memory
        this.memory = new ArrayBuffer(this.memSize);
        this.view = new DataView(this.memory);
        this.returnStack = [];
        console.log("[VM] VM state reset");
    }

    // Store type information when storing a value
    public storeValue(addr: number, value: number, typeInfo: TypeInfo): void {
        // Check if addr is valid
        if (addr < 0 || addr + 8 > this.memSize) {
            throw new Error(`Invalid memory address for write: ${addr}`);
        }
        
        // Store the value in memory
        this.view.setFloat64(addr, value, true);
        
        // Store the type information
        this.valueTypes.set(addr, typeInfo);
        
        console.log(`[VM] Stored ${value} (type: ${typeInfo.toString()}) at address ${addr}`);
    }

    // Get type information when loading a value
    public getValueType(addr: number): TypeInfo {
        return this.valueTypes.get(addr) || new TypeInfo(Type.ERORR);
    }

    private checkTypeCompatibility(actual: TypeInfo, expected: TypeInfo): boolean {
        // Basic case: exact type match
        if (actual.baseType === expected.baseType) {
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
            
            // Immutable references cannot be passed to mutable reference parameters
            return false;
        }
        
        return false;
    }
}
