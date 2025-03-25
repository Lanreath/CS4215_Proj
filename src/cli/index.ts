import { CharStream, CommonTokenStream } from 'antlr4ng';
import * as readline from 'readline';
import { RustLexer } from '../parser/src/RustLexer.js';
import { RustParser } from '../parser/src/RustParser.js';
import { RustEvaluatorVisitor } from '../RustEvaluator.js';
import { VirtualMachine } from '../VirtualMachine.js';

// Create a fresh evaluator for each session
const vm = new VirtualMachine();
const evaluator = new RustEvaluatorVisitor(vm);

// A flag to control debug output
const DEBUG = false;

function debugLog(message: string): void {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
    }
}

function evaluate(input: string): number {
    try {
        // Reset the VM state for each new evaluation
        vm.reset(); // Reset the VM state        
        // Create the lexer and parser
        debugLog(`Parsing input: "${input}"`);
        const inputStream = CharStream.fromString(input);
        const lexer = new RustLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new RustParser(tokenStream);
        
        // Parse the input
        debugLog('Creating parse tree');
        const tree = parser.prog();
        
        // Visit the parse tree
        debugLog('Visiting parse tree');
        evaluator.visit(tree);
        
        // Print VM instructions only in debug mode
        if (DEBUG) {
            console.log("\nVM Instructions:");
            vm.printInstructions();
        }
        
        // Run the VM only once
        debugLog('Running VM');
        const result = vm.run();
        debugLog(`VM returned: ${result}`);
        
        return result;
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Error: ${e.message}`);
        } else {
            console.error(`Unknown error: ${String(e)}`);
        }
        return 0;
    }
}

// Create the REPL
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Rust Interpreter with Ownership and Borrowing");
console.log("Type 'exit' to quit\n");
rl.setPrompt('> ');
rl.prompt();

// Handle each line of input only once
rl.on('line', (line) => {
    const input = line.trim();
    
    if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
    }
    
    // Skip empty lines
    if (input === '') {
        rl.prompt();
        return;
    }
    
    try {
        // Add a semicolon if missing for convenience
        const code = input.endsWith(';') ? input : `${input};`;
        
        // Evaluate the input and get the result
        const result = evaluate(code);
        
        // Print only one result
        console.log(`Result: ${result}`);
        
        // Only print VM instructions in debug mode
        if (DEBUG) {
            console.log("VM Instructions:");
            vm.printInstructions();
        }
    } catch (e) {
        // Error already reported in evaluate function
    }
    
    // Prompt for the next input
    rl.prompt();
}).on('close', () => {
    console.log("\nExiting Rust Interpreter");
    process.exit(0);
});
