import { CharStream, CommonTokenStream } from 'antlr4ng';
import * as readline from 'readline';
import { RustLexer } from '../parser/src/RustLexer';
import { RustParser } from '../parser/src/RustParser';
import { RustEvaluatorVisitor } from '../RustEvaluator';
import { VirtualMachine } from '../VirtualMachine';
import * as fs from 'fs';
import * as path from 'path';

// Create a fresh evaluator for each session
const vm = new VirtualMachine();
const evaluator = new RustEvaluatorVisitor(vm);

// CLI configuration
const DEBUG = false;
const SHOW_VM_INSTRUCTIONS = false;

// Buffer for multi-line input
let codeBuffer: string[] = [];
let inMultiLineMode = false;

function debugLog(message: string): void {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
    }
}

function evaluate(input: string): { result: number, error: string | null } {
    try {
        // Reset the VM state for each new evaluation
        vm.reset();
        
        debugLog(`Parsing input: "${input}"`);
        const inputStream = CharStream.fromString(input);
        const lexer = new RustLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new RustParser(tokenStream);
        
        debugLog('Creating parse tree');
        const tree = parser.prog();
        
        debugLog('Visiting parse tree');
        evaluator.visit(tree);
        
        if (SHOW_VM_INSTRUCTIONS || DEBUG) {
            console.log("\nVM Instructions:");
            vm.printInstructions();
        }
        
        debugLog('Running VM');
        const result = vm.run();
        
        return { result, error: null };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { result: 0, error: errorMessage };
    }
}

// Create the REPL
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: inMultiLineMode ? '... ' : '> '
});

// Helper to get the current prompt
function getPrompt(): string {
    return inMultiLineMode ? '... ' : '> ';
}

// Handle commands
function handleCommand(cmd: string): boolean {
    const command = cmd.trim().toLowerCase();
    
    switch (command) {
        case 'exit':
        case 'quit':
            console.log("\nExiting Rust Interpreter");
            rl.close();
            return true;
            
        case 'clear':
            console.clear();
            return true;
            
        case 'help':
            console.log("\nRust Interpreter Commands:");
            console.log("  .help          - Show this help message");
            console.log("  .exit, .quit   - Exit the interpreter");
            console.log("  .clear         - Clear the screen");
            console.log("  .multi         - Enter multi-line mode");
            console.log("  .end           - End multi-line mode and execute code");
            return true;
            
        case 'multi':
            if (!inMultiLineMode) {
                inMultiLineMode = true;
                codeBuffer = [];
                console.log("Entering multi-line mode. Type .end to execute.");
                rl.setPrompt('... ');
            }
            return true;
            
        case 'end':
            if (inMultiLineMode) {
                inMultiLineMode = false;
                rl.setPrompt('> ');
                const code = codeBuffer.join('\n');
                codeBuffer = [];
                
                console.log("\nExecuting code...");
                if (code.trim() !== '') {
                    executeCode(code);
                }
            }
            return true;
    }  
    return false;
}

// Execute code
function executeCode(code: string): void {
    const { result, error } = evaluate(code);
    
    if (error) {
        console.error(`Error: ${error}`);
    } else {
        console.log(`Result: ${result}`);
    }
}

// Print welcome message
console.log("Rust Interpreter with Ownership and Borrowing");
console.log("Type .help for commands or .multi to enter multi-line mode");
console.log("Type .exit to quit\n");

// Set initial prompt
rl.setPrompt(getPrompt());
rl.prompt();

// Handle each line of input
rl.on('line', (line) => {
    const input = line.trim();
    
    // Check if this is a command (starting with .)
    if (input.startsWith('.')) {
        if (!handleCommand(input.substring(1))) {
            console.log(`Unknown command: ${input}`);
        }
        rl.setPrompt(getPrompt());
        rl.prompt();
        return;
    }
    
    // Skip empty lines when not in multi-line mode
    if (input === '' && !inMultiLineMode) {
        rl.prompt();
        return;
    }
    
    // In multi-line mode, add to buffer
    if (inMultiLineMode) {
        codeBuffer.push(line);
        rl.setPrompt('... ');
        rl.prompt();
        return;
    }
    
    // Single line execution
    // Add a semicolon if missing for convenience
    const code = input.endsWith(';') ? input : `${input};`;
    executeCode(code);
    
    // Prompt for the next input
    rl.prompt();
}).on('close', () => {
    process.exit(0);
});
