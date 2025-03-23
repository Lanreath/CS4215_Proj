import { CharStream, CommonTokenStream } from 'antlr4ng';
import * as readline from 'readline';
import { RustLexer } from '../parser/src/RustLexer.js';
import { RustParser } from '../parser/src/RustParser.js';
import { RustEvaluatorVisitor } from '../RustEvaluator.js';

const evaluator = new RustEvaluatorVisitor();

function evaluate(input: string): void {
    const inputStream = CharStream.fromString(input);
    const lexer = new RustLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new RustParser(tokenStream);
    const tree = parser.prog();

    evaluator.visit(tree);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.prompt();

rl.on('line', (line) => {
    try {
        evaluate(line + '\n');
    } catch (e) {
        console.error(e);
    }
    rl.prompt();
}).on('close', () => {
    evaluator.runVM();
    process.exit(0);
});
