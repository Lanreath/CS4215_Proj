enum InstructionTag {
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
    STORE = "STORE"
}
export class Instruction {
    public tag: InstructionTag;
    public value?: number;
    public first?: number;
    public second?: number;

    constructor (tag: InstructionTag, value?: number, first?: number, second?: number) {
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

    private static readonly OS_BASE = 0;
    private static readonly RS_BASE = 512;
    private static readonly HEAP_BASE = 1024; // Start of variable memory space

    private ic: number = 0;    // Instruction counter
    private instructions: Instruction[] = [];
    private pc: number = 0;    // Program counter
    private osPtr: number = 0; // Operand stack pointer
    private nextVarAddr: number = VirtualMachine.HEAP_BASE; // Next available variable address

    // Label support for VM jumps
    private labels: Map<string, number> = new Map();
    private forwardRefs: Map<string, number[]> = new Map();

    constructor(memSize: number = 4096) { // Ensure this is large enough
        this.memSize = memSize;
        this.memory = new ArrayBuffer(memSize);
        this.view = new DataView(this.memory);
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

    public pushInstruction(tag: string, value?: number): number {
        if (this.ic >= 10000) { 
            throw new Error("Program too large: exceeded maximum instruction count");
        }
        
        console.log(`[VM] Pushing instruction: ${tag}${value !== undefined ? ' ' + value : ''}`);
        const instr = new Instruction(tag as InstructionTag, value);
        this.instructions[this.ic] = instr;
        return ++this.ic;
    }

    public setInstructionTarget(instructionIndex: number, targetIndex: number): void {
        if (instructionIndex < 0 || instructionIndex >= this.ic) {
            throw new Error("Invalid instruction index");
        }
        if (targetIndex < 0 || targetIndex > this.ic) {
            throw new Error("Invalid target index");
        }
        if (this.instructions[instructionIndex].tag !== InstructionTag.GOTO && this.instructions[instructionIndex].tag !== InstructionTag.JOF) {
            console.log(this.instructions[instructionIndex]);
            throw new Error("Invalid instruction for target");
        }
        this.instructions[instructionIndex].value = targetIndex;
    }


    public pushOperand(value: number): void {
        const addr = VirtualMachine.OS_BASE + this.osPtr * 8; 
        if (addr >= VirtualMachine.RS_BASE) {
            throw new Error("Operand stack overflow");
        }
        this.view.setFloat64(addr, value, true);
        this.osPtr++;
    }

    private popTwoOperands(): [number, number] {
        if (this.osPtr < 2) {
            throw new Error("Not enough operands for binary operation");
        }
        
        const b = this.popOperand();
        const a = this.popOperand();
        return [a, b];
    }

    public popOperand(): number {
        if (this.osPtr <= 0) {
            throw new Error("Operand stack underflow");
        }
        this.osPtr--;
        const addr = VirtualMachine.OS_BASE + this.osPtr * 8;
        const value = this.view.getFloat64(addr, true);
        this.view.setFloat64(addr, 0, true);
        return value;
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
                console.log(`[VM] Executing: ${instr.tag}${instr.value !== undefined ? ' ' + instr.value : ''}`);
                
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

                    case InstructionTag.LOAD: {
                        if (instr.value === undefined) {
                            throw new Error("LOAD instruction missing address");
                        }
                        const address = instr.value;
                        const value = this.view.getFloat64(address);
                        this.pushOperand(value);
                        console.log(`[VM] LOAD: Loaded ${value} from address ${address}`);
                        break;
                    }
                    
                    case InstructionTag.STORE: {
                        if (instr.value === undefined) {
                            throw new Error("STORE instruction missing address");
                        }
                        const value = this.popOperand();
                        const address = instr.value;
                        this.view.setFloat64(address, value);
                        console.log(`[VM] STORE: Stored ${value} to address ${address}`);
                        break;
                    }
                    
                    case InstructionTag.JOF: {
                        if (instr.value === undefined) {
                            throw new Error("JOF instruction missing target");
                        }
                        
                        const condition = this.popOperand();
                        // Jump if the condition is false (0)
                        if (condition === 0) {
                            console.log(`[VM] JOF: Condition false, jumping to ${instr.value}`);
                            this.pc = instr.value;
                        } else {
                            console.log(`[VM] JOF: Condition true, continuing`);
                        }
                        break;
                    }
                    
                    default:
                        console.warn(`Unknown instruction: ${instr.tag}`);
                }
            }
            
            // No DONE instruction found
            return this.osPtr > 0 ? this.popOperand() : 0;
        } catch (error) {
            console.error('VM runtime error:', error);
            throw error;
        }
    }

    // Improve the allocateVariable method to properly check bounds
    public allocateVariable(): number {
        // Check if we have enough memory before allocating
        if (this.nextVarAddr + 8 > this.memSize) {
            throw new Error(`Out of memory: Tried to allocate beyond ${this.memSize} bytes`);
        }
    
        const addr = this.nextVarAddr;
        this.nextVarAddr += 8; // Allocate 8 bytes for all values
        return addr;
    }

    public storeValue(addr: number, value: number): void {
        // Safety check to prevent out-of-bounds writes
        if (addr < 0 || addr + 8 > this.memSize) {
            throw new Error(`Invalid memory address for write: ${addr}`);
        }
        
        this.view.setFloat64(addr, value, true);
    }

    public loadValue(addr: number): number {
        // Safety check to prevent out-of-bounds reads
        if (addr < 0 || addr + 8 > this.memSize) {
            throw new Error(`Invalid memory address for read: ${addr}`);
        }
        
        return this.view.getFloat64(addr, true);
    }

    public reset(): void {
        this.ic = 0;
        this.pc = 0;
        this.osPtr = VirtualMachine.OS_BASE;
        this.instructions = [];
        this.nextVarAddr = VirtualMachine.HEAP_BASE;
        
        // Clear memory
        this.labels.clear();
        this.forwardRefs.clear();
        this.memory = new ArrayBuffer(this.memSize);
        this.view = new DataView(this.memory);
    }

    // Add a label at the current instruction counter
    public addLabel(label: string): void {
        console.log(`[VM] Adding label '${label}' at instruction ${this.ic}`);
        this.labels.set(label, this.ic);

        // Resolve any forward references to this label
        if (this.forwardRefs.has(label)) {
            const refs = this.forwardRefs.get(label)!;
            console.log(`[VM] Resolving ${refs.length} forward references to label '${label}'`);
            
            for (const instructionIndex of refs) {
                this.setInstructionTarget(instructionIndex, this.ic);
                console.log(`[VM] Resolved jump at instruction ${instructionIndex} to target ${this.ic}`);
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
            this.setInstructionTarget(idx-1, this.labels.get(label)!);
        } else {
            if (!this.forwardRefs.has(label)) {
                this.forwardRefs.set(label, []);
            }
            this.forwardRefs.get(label)!.push(idx-1);
            console.log(`[VM] Added forward reference to label '${label}' from instruction ${idx-1}`);
        }
        
        return idx;
    }

    // Push a jump-on-false instruction that will be resolved later
    public pushJof(label: string): number {
        console.log(`[VM] Pushing JOF to '${label}'`);
        const idx = this.pushInstruction(InstructionTag.JOF);
        
        // If the label already exists, set the target
        if (this.labels.has(label)) {
            this.setInstructionTarget(idx-1, this.labels.get(label)!);
        } else {
            if (!this.forwardRefs.has(label)) {
                this.forwardRefs.set(label, []);
            }
            this.forwardRefs.get(label)!.push(idx-1);
            console.log(`[VM] Added forward reference to label '${label}' from instruction ${idx-1}`);
        }
        
        return idx;
    }
}