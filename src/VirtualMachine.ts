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
    FETCH = "FETCH",
    PUT = "PUT",
    FREE = "FREE",
    CALL = "CALL",
    RETURN = "RETURN",
    NEG = "NEG",                   // Negate a value
    AND = "AND",                   // Logical AND
    OR = "OR",                     // Logical OR
    NOT = "NOT",                   // Logical NOT
    DUP = "DUP",                   // Duplicate the top value on the stack
    POP = "POP",                   // Pop the top value from the stack
}
export class Instruction {
    public tag: InstructionTag;
    public value?: number;
    public isBool?: boolean;

    constructor(tag: InstructionTag, value?: number, isBool: boolean = false) {
        this.tag = tag;
        this.value = value;
        this.isBool = isBool;
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

    private static readonly TYPE_INT = 1;
    private static readonly TYPE_BOOL = 2;

    private static readonly TYPE_OFFSET = 0;
    private static readonly VALUE_OFFSET = 1;

    private ic: number = 0; // Instruction counter
    private instructions: Instruction[] = [];
    private pc: number = 0; // Program counter
    private osPtr: number = 0; // Operand stack pointer
    private rsPtr: number = 0; // Runtime stack pointer

    private returnStack: number[] = [];

    constructor(memSize: number = 4096) {
        // Ensure this is large enough
        this.memSize = memSize;
        this.memory = new ArrayBuffer(memSize);
        this.view = new DataView(this.memory);
    }

    private storeTyped(addr: number, value: number, type: number): void {
        const heapAddr = VirtualMachine.RS_BASE + addr;
        if (heapAddr < VirtualMachine.RS_BASE || heapAddr + 5 > this.memSize) {
            throw new Error(`Invalid memory address for store: ${addr}`);
        }

        // Store type tag (1 byte)
        this.view.setInt8(heapAddr + VirtualMachine.TYPE_OFFSET, type);

        // Store value (1 or 4 bytes depending on type)
        if (type === VirtualMachine.TYPE_BOOL) {
            this.view.setInt8(heapAddr + VirtualMachine.VALUE_OFFSET, value ? 1 : 0);
        } else {
            this.view.setInt32(heapAddr + VirtualMachine.VALUE_OFFSET, value);
        }
    }

    private loadTyped(addr: number): [number, number] {
        const heapAddr = VirtualMachine.RS_BASE + addr;
        if (heapAddr < VirtualMachine.RS_BASE || heapAddr + 5 > this.memSize) {
            throw new Error(`Invalid memory address for load: ${addr}`);
        }

        // Load type tag
        const type = this.view.getInt8(heapAddr + VirtualMachine.TYPE_OFFSET);

        // Load value based on type
        let value: number;
        if (type === VirtualMachine.TYPE_BOOL) {
            value = this.view.getInt8(heapAddr + VirtualMachine.VALUE_OFFSET);
        } else {
            value = this.view.getInt32(heapAddr + VirtualMachine.VALUE_OFFSET);
        }

        return [value, type];
    }

    private pushOperand(value: number, isBool: boolean = false): void {
        const addr = VirtualMachine.OS_BASE + this.osPtr * (isBool ? 2 : 5);
        if (addr >= VirtualMachine.RT_BASE) {
            throw new Error("Operand stack overflow");
        }
        if (isBool) {
            this.view.setInt8(addr + VirtualMachine.TYPE_OFFSET, VirtualMachine.TYPE_BOOL);
            this.view.setInt8(addr + VirtualMachine.VALUE_OFFSET, value ? 1 : 0);
        } else {
            this.view.setInt8(addr + VirtualMachine.TYPE_OFFSET, VirtualMachine.TYPE_INT);
            this.view.setInt32(addr + VirtualMachine.VALUE_OFFSET, value);
        }
        this.osPtr++;
    }

    private popOperand(): number {
        if (this.osPtr <= 0) {
            throw new Error("Operand stack underflow");
        }
        this.osPtr--;
        const addr = VirtualMachine.OS_BASE + this.osPtr * 5; // Use maximum size for alignment
        const type = this.view.getInt8(addr + VirtualMachine.TYPE_OFFSET);
        const value = type === VirtualMachine.TYPE_BOOL
            ? this.view.getInt8(addr + VirtualMachine.VALUE_OFFSET)
            : this.view.getInt32(addr + VirtualMachine.VALUE_OFFSET);
        return value;
    }

    private peekOperand(): number {
        if (this.osPtr <= 0) {
            throw new Error("Operand stack underflow");
        }
        const addr = VirtualMachine.OS_BASE + (this.osPtr - 1) * 5; // Use maximum size for alignment
        const type = this.view.getInt8(addr + VirtualMachine.TYPE_OFFSET);
        const value = type === VirtualMachine.TYPE_BOOL
            ? this.view.getInt8(addr + VirtualMachine.VALUE_OFFSET)
            : this.view.getInt32(addr + VirtualMachine.VALUE_OFFSET);
        return value;
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

    private load(addr: number): number {
        const [value, _] = this.loadTyped(addr);
        return value;
    }

    private store(addr: number, value: number, isBool: boolean = false): void {
        this.storeTyped(addr, value, isBool ? VirtualMachine.TYPE_BOOL : VirtualMachine.TYPE_INT);
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

    public pushInstruction(tag: InstructionTag, value?: number, isBool: boolean = false): number {
        console.log(
            `[VM] Pushing instruction: ${tag}${value !== undefined ? " " + value : ""} (${isBool ? "bool" : "int"})`
        );
        const instr = new Instruction(tag, value, isBool);
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
        // Check type tag
        const type = this.view.getInt8(heapAddr + VirtualMachine.TYPE_OFFSET);
        if (type !== VirtualMachine.TYPE_BOOL && type !== VirtualMachine.TYPE_INT) {
            throw new Error(`Invalid type tag for free: ${type}`);
        }
        // Clear the memory
        this.view.setInt8(heapAddr + VirtualMachine.TYPE_OFFSET, 0);
        if (type === VirtualMachine.TYPE_BOOL) {
            this.view.setInt8(heapAddr + VirtualMachine.VALUE_OFFSET, 0);
        }
        else {
            this.view.setInt32(heapAddr + VirtualMachine.VALUE_OFFSET, 0);
        }
        console.log(`[VM] Freed memory at address ${addr}`);
    }

    public allocateVariable(isBool: boolean = false): number {
        const addr = this.rsPtr;
        const size = isBool ? 2 : 5; // 1 byte type + (1 or 4) bytes value
        if (VirtualMachine.RS_BASE + addr + size > this.memSize) {
            throw new Error("Runtime stack overflow");
        }
        this.rsPtr += size;
        return addr;
    }

    public run(): number {
        this.pc = 0;
        this.osPtr = 0; // Reset operand stack pointer
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
                        this.store(instr.value, value, instr.isBool);
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
                    case InstructionTag.PUT: {
                        // Pop an address and a value from the stack
                        const addr = this.popOperand();
                        const value = this.popOperand();
                        
                        // Store the value at that address
                        this.store(addr, value, instr.isBool);
                        console.log(`[VM] PUT: Stored ${value} at address ${addr}`);
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
                        this.pushReturn(this.pc); 
                        this.pc = instr.value;
                        break;
                    }
                    case InstructionTag.RETURN: {
                        const returnAddr = this.popReturn();
                        console.log(`[VM] RETURN: Returning to ${returnAddr}`);
                        this.pc = returnAddr;
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
                    
                    case InstructionTag.AND: {
                        const b = this.popOperand();
                        const a = this.popOperand();
                        this.pushOperand(a !== 0 && b !== 0 ? 1 : 0, true);
                        break;
                    }
                    case InstructionTag.OR: {
                        const b = this.popOperand();
                        const a = this.popOperand();
                        this.pushOperand(a !== 0 || b !== 0 ? 1 : 0, true);
                        break;
                    }
                    case InstructionTag.NOT: {
                        const a = this.popOperand();
                        this.pushOperand(a === 0 ? 1 : 0, true);
                        break;
                    }
                    case InstructionTag.DUP:
                        const a = this.popOperand();
                        this.pushOperand(a);
                        this.pushOperand(a);
                        break;
                    case InstructionTag.POP:
                        this.popOperand();
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
        this.labels = new Map();
        this.forwardRefs = new Map();
        this.rsPtr = VirtualMachine.RS_BASE;

        // Clear memory
        this.memory = new ArrayBuffer(this.memSize);
        this.view = new DataView(this.memory);
        this.returnStack = [];
        console.log("[VM] VM state reset");
    }

    // Store type information when storing a value
    public storeValue(addr: number, value: number): void {
        // Check if addr is valid
        if (addr < 0 || addr + 8 > this.memSize) {
            throw new Error(`Invalid memory address for write: ${addr}`);
        }
        
        // Store the value in memory
        this.view.setInt32(addr, value, true);
    }

}
