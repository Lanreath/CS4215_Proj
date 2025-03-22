import { CharStream, CommonTokenStream } from 'antlr4ng';
import * as readline from 'readline';
import { RustLexer } from '../plugin/src/parser/src/RustLexer.js';
import { RustParser } from '../plugin/src/parser/src/RustParser.js';
import { RustVisitor } from '../plugin/src/parser/src/RustVisitor.js';

const evaluator = new RustVisitor();

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
    evaluate(line);
    rl.prompt();
}).on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
});
