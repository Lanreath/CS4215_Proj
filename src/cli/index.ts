import { CharStream, CommonTokenStream } from 'antlr4ng';
import * as readline from 'readline';
import { RustLexer } from '../parser/src/RustLexer';
import { RustParser } from '../parser/src/RustParser';
import { RustEvaluatorVisitor } from '../RustEvaluator';
import { VirtualMachine } from '../VirtualMachine';
import * as fs from 'fs';

// Create a fresh evaluator for each session
const vm = new VirtualMachine();
const evaluator = new RustEvaluatorVisitor(vm);

// CLI configuration
const DEBUG = false;
const SHOW_VM_INSTRUCTIONS = false;

// Buffer for multi-line input
let codeBuffer: string[] = [];
let inMultiLineMode = true; // Default to multi-line mode

function debugLog(message: string): void {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
    }
}

function evaluate(input: string): { result: number | boolean, error: string | null } {
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
        evaluator.compile(tree);

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
    prompt: '... ' // Start with multi-line prompt
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
            console.log("  .single        - Enter single-line mode");
            console.log("  .multi         - Enter multi-line mode (default)");
            console.log("  .end           - End multi-line mode and execute code");
            console.log("  Empty line     - End multi-line mode and execute code");
            console.log("  .test          - Run tests from test.txt and compare with result.txt");
            return true;

        case 'multi':
            if (!inMultiLineMode) {
                inMultiLineMode = true;
                codeBuffer = [];
                console.log("Entering multi-line mode. Type .end or an empty line to execute.");
                rl.setPrompt('... ');
            }
            return true;

        case 'single':
            if (inMultiLineMode) {
                // Execute any pending code in buffer
                if (codeBuffer.length > 0) {
                    const code = codeBuffer.join('\n');
                    codeBuffer = [];
                    console.log("\nExecuting code...");
                    if (code.trim() !== '') {
                        executeCode(code);
                    }
                }

                inMultiLineMode = false;
                console.log("Entering single-line mode. Each line will be executed immediately.");
                rl.setPrompt('> ');
            }
            return true;
        case 'test':
            // Test function
            const inputFile = 'test.txt';
            const resultFile = 'result.txt';
            console.log(`Running tests from ${inputFile}...`);
            testRustCode(inputFile, resultFile);
            return true;
        case 'end':
            if (inMultiLineMode && codeBuffer.length > 0) {
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

// Write a test function with input files test.txt and result.txt
// Test cases are separated by ``` in the input file
// and the expected result is in the result file separated by newlines (number, bool, error)
function testRustCode(inputFile: string, resultFile: string): void {
    const input = fs.readFileSync(inputFile, 'utf8');
    const expectedResults = fs.readFileSync(resultFile, 'utf8').split('\n').map(line => line.trim()).filter(line => line !== '');

    const testCases = input.split(/```/).map(code => code.trim()).filter(code => code !== '');
    
    if (testCases.length !== expectedResults.length) {
        console.error(`Warning: Number of test cases (${testCases.length}) and expected results (${expectedResults.length}) do not match.`);
    }
    
    // Test results tracking
    const testResults = {
        passed: 0,
        failed: 0,
        errors: [] as {testNumber: number, testCase: string, expected: string, actual: string, error?: string}[]
    };
    
    console.log("\n=== RUNNING TESTS ===\n");
    
    // Run each test case separately
    for (let i = 0; i < testCases.length && i < expectedResults.length; i++) {
        const testCase = testCases[i];
        const expectedResult = expectedResults[i];
        
        try {
            // Reset the VM for each test
            vm.reset();
            evaluator.reset();
            
            console.log(`Test case ${i + 1}:`);
            console.log("--------------------");
            console.log(testCase);
            console.log("--------------------");
            
            const { result, error } = evaluate(testCase);
            
            if (error) {
                if (expectedResult === 'error') {
                    console.log(`✅ PASS: Expected error and got: ${error}\n`);
                    testResults.passed++;
                } else {
                    console.error(`❌ FAIL: Expected ${expectedResult}, but got error: ${error}\n`);
                    testResults.failed++;
                    testResults.errors.push({
                        testNumber: i + 1,
                        testCase,
                        expected: expectedResult,
                        actual: `Error: ${error}`,
                        error
                    });
                }
            } else {
                if (String(result) === expectedResult) {
                    console.log(`✅ PASS: Result ${result} matches expected ${expectedResult}\n`);
                    testResults.passed++;
                } else {
                    console.error(`❌ FAIL: Expected ${expectedResult}, but got ${result}\n`);
                    testResults.failed++;
                    testResults.errors.push({
                        testNumber: i + 1,
                        testCase,
                        expected: expectedResult,
                        actual: String(result)
                    });
                }
            }
        } catch (unexpectedError) {
            // Catch any uncaught exceptions to prevent test runner from crashing
            const errorMessage = unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError);
            console.error(`❌ CRASH: Unexpected error in test runner: ${errorMessage}\n`);
            testResults.failed++;
            testResults.errors.push({
                testNumber: i + 1,
                testCase,
                expected: expectedResult,
                actual: "Test runner crashed",
                error: errorMessage
            });
        }
    }
    
    // Report summary
    console.log("\n=== TEST SUMMARY ===");
    console.log(`Total tests: ${testResults.passed + testResults.failed}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    
    // Show details of failed tests
    if (testResults.errors.length > 0) {
        console.log("\n=== FAILED TESTS ===");
        testResults.errors.forEach(error => {
            console.log(`\nTest #${error.testNumber}:`);
            console.log("--------------------");
            console.log(error.testCase);
            console.log("--------------------");
            console.log(`Expected: ${error.expected}`);
            console.log(`Actual: ${error.actual}`);
            if (error.error) {
                console.log(`Error: ${error.error}`);
            }
        });
    }
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
console.log("MULTI-LINE MODE: Enter code and use an empty line or .end to execute");
console.log("Type .help for commands or .single to enter single-line mode");
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

    // In multi-line mode, empty line executes the buffer
    if (input === '' && inMultiLineMode && codeBuffer.length > 0) {
        const code = codeBuffer.join('\n');
        codeBuffer = [];

        console.log("\nExecuting code...");
        if (code.trim() !== '') {
            executeCode(code);
        }
        rl.prompt();
        return;
    }

    // Skip other empty lines
    if (input === '') {
        rl.prompt();
        return;
    }

    // In multi-line mode, add to buffer
    if (inMultiLineMode) {
        codeBuffer.push(line);
        rl.prompt();
        return;
    }

    // Single line execution
    executeCode(input);

    // Prompt for the next input
    rl.prompt();
}).on('close', () => {
    process.exit(0);
});
