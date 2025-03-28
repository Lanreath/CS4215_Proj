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
  STORE = "STORE",
  FREE = "FREE",
  CALL = "CALL",
  RETURN = "RETURN",
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

  private static readonly OS_BASE = 0;
  private static readonly RS_BASE = 1024;

  private ic: number = 0; // Instruction counter
  private instructions: Instruction[] = [];
  private pc: number = 0; // Program counter
  private osPtr: number = 0; // Operand stack pointer
  private rsPtr: number = 0; // Return stack pointer

  constructor(memSize: number = 4096) {
    // Ensure this is large enough
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
    console.log(
      `[VM] Pushing instruction: ${tag}${
        value !== undefined ? " " + value : ""
      }`
    );
    const instr = new Instruction(tag as InstructionTag, value);
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

  private pushOperand(value: number): void {
    const addr = VirtualMachine.OS_BASE + this.osPtr * 4;
    if (addr >= VirtualMachine.RS_BASE) {
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

  private load(addr: number): number {
    const heapAddr = VirtualMachine.RS_BASE + addr;
    if (heapAddr < VirtualMachine.RS_BASE || heapAddr >= this.memSize) {
      throw new Error(`Invalid memory address for load: ${addr}`);
    }
    const value = this.view.getInt32(heapAddr);
    if (isNaN(value)) {
      throw new Error(`Invalid symbol at address ${addr}`);
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

  public free(addr: number): void {
    const heapAddr = VirtualMachine.RS_BASE + addr;
    if (heapAddr < VirtualMachine.RS_BASE || heapAddr >= this.memSize) {
      throw new Error(`Invalid memory address for free: ${addr}`);
    }
    this.view.setInt32(heapAddr, 0);
  }

  public allocateVariable(): number {
    const addr = this.rsPtr;
    if (addr >= this.memSize) {
      throw new Error("Runtime stack overflow");
    }
    this.rsPtr += 4; // Allocate 4 bytes for an integer
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
          `[VM] Executing: ${instr.tag}${
            instr.value !== undefined ? " " + instr.value : ""
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
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a + b;
            console.log(`[VM] PLUS: ${a} + ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }
          case InstructionTag.MINUS: {
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a - b;
            console.log(`[VM] MINUS: ${a} - ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }

          case InstructionTag.TIMES: {
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a * b;
            console.log(`[VM] TIMES: ${a} * ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }
          case InstructionTag.DIVIDE: {
            const b = this.popOperand();
            const a = this.popOperand();

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
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a < b ? 1 : 0;
            console.log(`[VM] LT: ${a} < ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }
          case InstructionTag.LE: {
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a <= b ? 1 : 0;
            console.log(`[VM] LE: ${a} <= ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }
          case InstructionTag.GT: {
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a > b ? 1 : 0;
            console.log(`[VM] GT: ${a} > ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }
          case InstructionTag.GE: {
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a >= b ? 1 : 0;
            console.log(`[VM] GE: ${a} >= ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }
          case InstructionTag.EQ: {
            const b = this.popOperand();
            const a = this.popOperand();
            const result = a === b ? 1 : 0;
            console.log(`[VM] EQ: ${a} == ${b} = ${result}`);
            this.pushOperand(result);
            break;
          }
          case InstructionTag.NE: {
            const b = this.popOperand();
            const a = this.popOperand();
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
            console.log(`[VM] LOAD: Loaded symbol at ${instr.value}: ${value}`);
            this.pushOperand(value);
            break;
          }
          case InstructionTag.STORE: {
            if (instr.value === undefined) {
              throw new Error("STORE instruction missing address");
            }
            const value = this.popOperand();
            console.log(`[VM] STORE: Storing ${value} at symbol ${instr.value}`);
            this.store(instr.value, value);
            break;
          }
          case InstructionTag.FREE: {
            if (instr.value === undefined) {
              throw new Error("FREE instruction missing address");
            }
            console.log(`[VM] FREE: Freeing symbol at ${instr.value}`);
            this.free(instr.value);
            break;
          }
          case InstructionTag.CALL: {
            if (instr.value === undefined) {
              throw new Error("CALL instruction missing address");
            }
            console.log(`[VM] CALL: Calling function at ${instr.value}`);
            this.pushOperand(this.pc + 1); // Return address
            this.pc = instr.value;
            break;
          }
          case InstructionTag.RETURN: {
            const returnAddr = this.popOperand();
            console.log(`[VM] RETURN: Returning to ${returnAddr}`);
            this.pc = returnAddr;
            break;
          }
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
  }
}
