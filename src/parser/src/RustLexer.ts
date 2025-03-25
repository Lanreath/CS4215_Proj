// Generated from src/Rust.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";


export class RustLexer extends antlr.Lexer {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly T__8 = 9;
    public static readonly T__9 = 10;
    public static readonly T__10 = 11;
    public static readonly T__11 = 12;
    public static readonly T__12 = 13;
    public static readonly T__13 = 14;
    public static readonly T__14 = 15;
    public static readonly T__15 = 16;
    public static readonly T__16 = 17;
    public static readonly T__17 = 18;
    public static readonly T__18 = 19;
    public static readonly T__19 = 20;
    public static readonly T__20 = 21;
    public static readonly T__21 = 22;
    public static readonly T__22 = 23;
    public static readonly T__23 = 24;
    public static readonly T__24 = 25;
    public static readonly T__25 = 26;
    public static readonly T__26 = 27;
    public static readonly T__27 = 28;
    public static readonly IDENTIFIER = 29;
    public static readonly INT = 30;
    public static readonly WS = 31;

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

    public static readonly literalNames = [
        null, "'return'", "';'", "'let'", "'mut'", "':'", "'='", "'fn'", 
        "'('", "')'", "'->'", "','", "'{'", "'}'", "'if'", "'else'", "'while'", 
        "'*'", "'&'", "'>'", "'>='", "'<'", "'<='", "'=='", "'!='", "'/'", 
        "'+'", "'-'", "'i64'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, "IDENTIFIER", "INT", "WS"
    ];

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", 
        "T__8", "T__9", "T__10", "T__11", "T__12", "T__13", "T__14", "T__15", 
        "T__16", "T__17", "T__18", "T__19", "T__20", "T__21", "T__22", "T__23", 
        "T__24", "T__25", "T__26", "T__27", "IDENTIFIER", "INT", "WS",
    ];


    public constructor(input: antlr.CharStream) {
        super(input);
        this.interpreter = new antlr.LexerATNSimulator(this, RustLexer._ATN, RustLexer.decisionsToDFA, new antlr.PredictionContextCache());
    }

    public get grammarFileName(): string { return "Rust.g4"; }

    public get literalNames(): (string | null)[] { return RustLexer.literalNames; }
    public get symbolicNames(): (string | null)[] { return RustLexer.symbolicNames; }
    public get ruleNames(): string[] { return RustLexer.ruleNames; }

    public get serializedATN(): number[] { return RustLexer._serializedATN; }

    public get channelNames(): string[] { return RustLexer.channelNames; }

    public get modeNames(): string[] { return RustLexer.modeNames; }

    public static readonly _serializedATN: number[] = [
        4,0,31,163,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,
        2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,
        13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,
        19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,
        26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,1,1,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,4,1,4,1,5,
        1,5,1,6,1,6,1,6,1,7,1,7,1,8,1,8,1,9,1,9,1,9,1,10,1,10,1,11,1,11,
        1,12,1,12,1,13,1,13,1,13,1,14,1,14,1,14,1,14,1,14,1,15,1,15,1,15,
        1,15,1,15,1,15,1,16,1,16,1,17,1,17,1,18,1,18,1,19,1,19,1,19,1,20,
        1,20,1,21,1,21,1,21,1,22,1,22,1,22,1,23,1,23,1,23,1,24,1,24,1,25,
        1,25,1,26,1,26,1,27,1,27,1,27,1,27,1,28,1,28,5,28,147,8,28,10,28,
        12,28,150,9,28,1,29,4,29,153,8,29,11,29,12,29,154,1,30,4,30,158,
        8,30,11,30,12,30,159,1,30,1,30,0,0,31,1,1,3,2,5,3,7,4,9,5,11,6,13,
        7,15,8,17,9,19,10,21,11,23,12,25,13,27,14,29,15,31,16,33,17,35,18,
        37,19,39,20,41,21,43,22,45,23,47,24,49,25,51,26,53,27,55,28,57,29,
        59,30,61,31,1,0,4,3,0,65,90,95,95,97,122,4,0,48,57,65,90,95,95,97,
        122,1,0,48,57,3,0,9,10,13,13,32,32,165,0,1,1,0,0,0,0,3,1,0,0,0,0,
        5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,
        1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,0,0,0,0,25,
        1,0,0,0,0,27,1,0,0,0,0,29,1,0,0,0,0,31,1,0,0,0,0,33,1,0,0,0,0,35,
        1,0,0,0,0,37,1,0,0,0,0,39,1,0,0,0,0,41,1,0,0,0,0,43,1,0,0,0,0,45,
        1,0,0,0,0,47,1,0,0,0,0,49,1,0,0,0,0,51,1,0,0,0,0,53,1,0,0,0,0,55,
        1,0,0,0,0,57,1,0,0,0,0,59,1,0,0,0,0,61,1,0,0,0,1,63,1,0,0,0,3,70,
        1,0,0,0,5,72,1,0,0,0,7,76,1,0,0,0,9,80,1,0,0,0,11,82,1,0,0,0,13,
        84,1,0,0,0,15,87,1,0,0,0,17,89,1,0,0,0,19,91,1,0,0,0,21,94,1,0,0,
        0,23,96,1,0,0,0,25,98,1,0,0,0,27,100,1,0,0,0,29,103,1,0,0,0,31,108,
        1,0,0,0,33,114,1,0,0,0,35,116,1,0,0,0,37,118,1,0,0,0,39,120,1,0,
        0,0,41,123,1,0,0,0,43,125,1,0,0,0,45,128,1,0,0,0,47,131,1,0,0,0,
        49,134,1,0,0,0,51,136,1,0,0,0,53,138,1,0,0,0,55,140,1,0,0,0,57,144,
        1,0,0,0,59,152,1,0,0,0,61,157,1,0,0,0,63,64,5,114,0,0,64,65,5,101,
        0,0,65,66,5,116,0,0,66,67,5,117,0,0,67,68,5,114,0,0,68,69,5,110,
        0,0,69,2,1,0,0,0,70,71,5,59,0,0,71,4,1,0,0,0,72,73,5,108,0,0,73,
        74,5,101,0,0,74,75,5,116,0,0,75,6,1,0,0,0,76,77,5,109,0,0,77,78,
        5,117,0,0,78,79,5,116,0,0,79,8,1,0,0,0,80,81,5,58,0,0,81,10,1,0,
        0,0,82,83,5,61,0,0,83,12,1,0,0,0,84,85,5,102,0,0,85,86,5,110,0,0,
        86,14,1,0,0,0,87,88,5,40,0,0,88,16,1,0,0,0,89,90,5,41,0,0,90,18,
        1,0,0,0,91,92,5,45,0,0,92,93,5,62,0,0,93,20,1,0,0,0,94,95,5,44,0,
        0,95,22,1,0,0,0,96,97,5,123,0,0,97,24,1,0,0,0,98,99,5,125,0,0,99,
        26,1,0,0,0,100,101,5,105,0,0,101,102,5,102,0,0,102,28,1,0,0,0,103,
        104,5,101,0,0,104,105,5,108,0,0,105,106,5,115,0,0,106,107,5,101,
        0,0,107,30,1,0,0,0,108,109,5,119,0,0,109,110,5,104,0,0,110,111,5,
        105,0,0,111,112,5,108,0,0,112,113,5,101,0,0,113,32,1,0,0,0,114,115,
        5,42,0,0,115,34,1,0,0,0,116,117,5,38,0,0,117,36,1,0,0,0,118,119,
        5,62,0,0,119,38,1,0,0,0,120,121,5,62,0,0,121,122,5,61,0,0,122,40,
        1,0,0,0,123,124,5,60,0,0,124,42,1,0,0,0,125,126,5,60,0,0,126,127,
        5,61,0,0,127,44,1,0,0,0,128,129,5,61,0,0,129,130,5,61,0,0,130,46,
        1,0,0,0,131,132,5,33,0,0,132,133,5,61,0,0,133,48,1,0,0,0,134,135,
        5,47,0,0,135,50,1,0,0,0,136,137,5,43,0,0,137,52,1,0,0,0,138,139,
        5,45,0,0,139,54,1,0,0,0,140,141,5,105,0,0,141,142,5,54,0,0,142,143,
        5,52,0,0,143,56,1,0,0,0,144,148,7,0,0,0,145,147,7,1,0,0,146,145,
        1,0,0,0,147,150,1,0,0,0,148,146,1,0,0,0,148,149,1,0,0,0,149,58,1,
        0,0,0,150,148,1,0,0,0,151,153,7,2,0,0,152,151,1,0,0,0,153,154,1,
        0,0,0,154,152,1,0,0,0,154,155,1,0,0,0,155,60,1,0,0,0,156,158,7,3,
        0,0,157,156,1,0,0,0,158,159,1,0,0,0,159,157,1,0,0,0,159,160,1,0,
        0,0,160,161,1,0,0,0,161,162,6,30,0,0,162,62,1,0,0,0,4,0,148,154,
        159,1,6,0,0
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!RustLexer.__ATN) {
            RustLexer.__ATN = new antlr.ATNDeserializer().deserialize(RustLexer._serializedATN);
        }

        return RustLexer.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(RustLexer.literalNames, RustLexer.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return RustLexer.vocabulary;
    }

    private static readonly decisionsToDFA = RustLexer._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}