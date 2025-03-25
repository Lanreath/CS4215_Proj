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
        const addr = VirtualMachine.OS_BASE + this.osPtr * 4;
        if (addr >= VirtualMachine.RS_BASE) {
            throw new Error("Operand stack overflow");
        }
        this.view.setInt32(addr, value);
        this.osPtr++;
    }

    public popOperand(): number {
        if (this.osPtr <= 0) {
            throw new Error("Operand stack underflow");
        }
        this.osPtr--;
        const addr = VirtualMachine.OS_BASE + this.osPtr * 4;
        const value = this.view.getInt32(addr);
        this.view.setInt32(addr, 0);
        return value;
    }

    public run(): number {
        this.pc = 0;
        this.osPtr = VirtualMachine.OS_BASE;
        
        try {
            while (this.pc < this.ic) {
                const instr = this.instructions[this.pc++];
                
                if (!instr) {
                    throw new Error(`Invalid instruction at ${this.pc - 1}`);
                }
                
                switch (instr.tag) {
                    case "DONE":
                        // Return the top value from the stack
                        return this.osPtr > VirtualMachine.OS_BASE ? this.popOperand() : 0;
                        
                    case "LDCN":
                        if (instr.value !== undefined) {
                            this.pushOperand(instr.value);
                        } else {
                            console.warn(`LDCN with undefined value at ${this.pc - 1}`);
                            this.pushOperand(0);
                        }
                        break;
                    
                    case "PLUS": {
                        const b = this.popOperand();
                        const a = this.popOperand();
                        this.pushOperand(a + b);
                        break;
                    }
                    
                    // Handle other instructions...
                    
                    default:
                        console.warn(`Unknown instruction: ${instr.tag}`);
                }
            }
            
            // No DONE instruction found
            return this.osPtr > VirtualMachine.OS_BASE ? this.popOperand() : 0;
        } catch (error) {
            console.error('VM runtime error:', error);
            throw error;
        }
    }

    // Improve the allocateVariable method to properly check bounds
    public allocateVariable(): number {
        // Check if we have enough memory before allocating
        if (this.nextVarAddr + 4 > this.memSize) {
            throw new Error(`Out of memory: Tried to allocate beyond ${this.memSize} bytes`);
        }

        const addr = this.nextVarAddr;
        this.nextVarAddr += 4; // Allocate 4 bytes for an integer
        return addr;
    }

    public storeValue(addr: number, value: number): void {
        // Safety check to prevent out-of-bounds writes
        if (addr < 0 || addr + 4 > this.memSize) {
            throw new Error(`Invalid memory address for write: ${addr}`);
        }
        
        this.view.setInt32(addr, value, true);
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
        this.nextVarAddr = VirtualMachine.HEAP_BASE;
        
        // Clear memory
        this.memory = new ArrayBuffer(this.memSize);
        this.view = new DataView(this.memory);
    }
}