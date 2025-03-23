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

    private static readonly OS_BASE = 0
    // private static readonly ENV_BASE = 128; // Maybe use this for ownership
    private static readonly RS_BASE = 512;

    private ic: number = 0; // Instruction counter
    private instructions: Instruction[] = []; // Program instructions

    private pc: number = 0; // Program counter
    private osPtr: number = 0; // Operand stack pointer
    // private envPtr: number = 0; // Maybe use this for ownership
    private rsPtr: number = 0; // Runtime stack pointer

    constructor(size: number = 1024) {
        this.memory = new ArrayBuffer(size);
        this.view = new DataView(this.memory);
        this.memSize = size;
    }

    public getInstructionCounter(): number {
        return this.ic;
    }

    public printInstructions(): void {
        console.log("Instructions:\n");
        this.instructions.forEach((instruction, index) => {
            console.log(`${index}: ${instruction.toString()}\n`);
        });
    }

    public pushInstruction(instruction: string, value?: number): number {
        switch (instruction) {
            case "DONE":
                this.instructions.push(new Instruction(InstructionTag.DONE));
                break;
            case "LDCN":
                this.instructions.push(new Instruction(InstructionTag.LDCN, value));
                break;
            case "PLUS":
                this.instructions.push(new Instruction(InstructionTag.PLUS));
                break;
            case "MINUS":
                this.instructions.push(new Instruction(InstructionTag.MINUS));
                break;
            case "TIMES":
                this.instructions.push(new Instruction(InstructionTag.TIMES));
                break;
            case "DIVIDE":
                this.instructions.push(new Instruction(InstructionTag.DIVIDE));
                break;
            case "LT":
                this.instructions.push(new Instruction(InstructionTag.LT));
                break;
            case "LE":
                this.instructions.push(new Instruction(InstructionTag.LE));
                break;
            case "GT":
                this.instructions.push(new Instruction(InstructionTag.GT));
                break;
            case "GE":
                this.instructions.push(new Instruction(InstructionTag.GE));
                break;
            case "EQ":
                this.instructions.push(new Instruction(InstructionTag.EQ));
                break;
            case "NE":
                this.instructions.push(new Instruction(InstructionTag.NE));
                break;
            case "GOTO":
                this.instructions.push(new Instruction(InstructionTag.GOTO, value));
                break;
            case "JOF":
                this.instructions.push(new Instruction(InstructionTag.JOF, value));
                break;
            default:
                throw new Error("Invalid instruction");
        }
        this.ic++;
        return this.ic;
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
        while (this.pc < this.ic) {
            const instruction = this.instructions[this.pc++];
            let a: number;
            let b: number;
            switch (instruction.tag) {
                case InstructionTag.LDCN:
                    this.pushOperand(instruction.value);
                    break;
                case InstructionTag.PLUS:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(a + b);
                    break;
                case InstructionTag.MINUS:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(b - a);
                    break;
                case InstructionTag.TIMES:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(a * b);
                    break;
                case InstructionTag.DIVIDE:
                    a = this.popOperand();
                    b = this.popOperand();
                    // TODO: Handle using error operand
                    if (a === 0) {
                        throw new Error("Division by zero");
                    }
                    this.pushOperand(b / a);
                    break;
                case InstructionTag.LT:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(b < a ? 1 : 0);
                    break;
                case InstructionTag.LE:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(b <= a ? 1 : 0);
                    break;
                case InstructionTag.GT:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(b > a ? 1 : 0);
                    break;
                case InstructionTag.GE:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(b >= a ? 1 : 0);
                    break;
                case InstructionTag.EQ:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(b === a ? 1 : 0);
                    break;
                case InstructionTag.NE:
                    a = this.popOperand();
                    b = this.popOperand();
                    this.pushOperand(b !== a ? 1 : 0);
                    break;
                case InstructionTag.GOTO:
                    this.pc = instruction.value;
                    break;
                case InstructionTag.JOF:
                    const top = this.popOperand();
                    if (top === 0) {
                        this.pc = instruction.value;
                    }
                    break;
                case InstructionTag.DONE:
                    return this.popOperand();
                default:
                    throw new Error("Invalid instruction");
            }
        }
        throw new Error("No DONE instruction");
    }
}