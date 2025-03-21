// Generated from src/SimpleLang.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";


export class SimpleLangLexer extends antlr.Lexer {
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
    public static readonly IDENTIFIER = 13;
    public static readonly INT = 14;
    public static readonly MUT = 15;
    public static readonly WS = 16;

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

    public static readonly literalNames = [
        null, "'const'", "'let'", "'='", "';'", "'display'", "'('", "')'", 
        "'*'", "'/'", "'+'", "'-'", "'&'", null, null, "'mut'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, "IDENTIFIER", "INT", "MUT", "WS"
    ];

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", 
        "T__8", "T__9", "T__10", "T__11", "IDENTIFIER", "INT", "MUT", "WS",
    ];


    public constructor(input: antlr.CharStream) {
        super(input);
        this.interpreter = new antlr.LexerATNSimulator(this, SimpleLangLexer._ATN, SimpleLangLexer.decisionsToDFA, new antlr.PredictionContextCache());
    }

    public get grammarFileName(): string { return "SimpleLang.g4"; }

    public get literalNames(): (string | null)[] { return SimpleLangLexer.literalNames; }
    public get symbolicNames(): (string | null)[] { return SimpleLangLexer.symbolicNames; }
    public get ruleNames(): string[] { return SimpleLangLexer.ruleNames; }

    public get serializedATN(): number[] { return SimpleLangLexer._serializedATN; }

    public get channelNames(): string[] { return SimpleLangLexer.channelNames; }

    public get modeNames(): string[] { return SimpleLangLexer.modeNames; }

    public static readonly _serializedATN: number[] = [
        4,0,16,92,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,
        6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,
        7,13,2,14,7,14,2,15,7,15,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,
        1,2,1,2,1,3,1,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,6,1,6,
        1,7,1,7,1,8,1,8,1,9,1,9,1,10,1,10,1,11,1,11,1,12,1,12,5,12,72,8,
        12,10,12,12,12,75,9,12,1,13,4,13,78,8,13,11,13,12,13,79,1,14,1,14,
        1,14,1,14,1,15,4,15,87,8,15,11,15,12,15,88,1,15,1,15,0,0,16,1,1,
        3,2,5,3,7,4,9,5,11,6,13,7,15,8,17,9,19,10,21,11,23,12,25,13,27,14,
        29,15,31,16,1,0,4,3,0,65,90,95,95,97,122,4,0,48,57,65,90,95,95,97,
        122,1,0,48,57,3,0,9,10,13,13,32,32,94,0,1,1,0,0,0,0,3,1,0,0,0,0,
        5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,
        1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,0,0,0,0,25,
        1,0,0,0,0,27,1,0,0,0,0,29,1,0,0,0,0,31,1,0,0,0,1,33,1,0,0,0,3,39,
        1,0,0,0,5,43,1,0,0,0,7,45,1,0,0,0,9,47,1,0,0,0,11,55,1,0,0,0,13,
        57,1,0,0,0,15,59,1,0,0,0,17,61,1,0,0,0,19,63,1,0,0,0,21,65,1,0,0,
        0,23,67,1,0,0,0,25,69,1,0,0,0,27,77,1,0,0,0,29,81,1,0,0,0,31,86,
        1,0,0,0,33,34,5,99,0,0,34,35,5,111,0,0,35,36,5,110,0,0,36,37,5,115,
        0,0,37,38,5,116,0,0,38,2,1,0,0,0,39,40,5,108,0,0,40,41,5,101,0,0,
        41,42,5,116,0,0,42,4,1,0,0,0,43,44,5,61,0,0,44,6,1,0,0,0,45,46,5,
        59,0,0,46,8,1,0,0,0,47,48,5,100,0,0,48,49,5,105,0,0,49,50,5,115,
        0,0,50,51,5,112,0,0,51,52,5,108,0,0,52,53,5,97,0,0,53,54,5,121,0,
        0,54,10,1,0,0,0,55,56,5,40,0,0,56,12,1,0,0,0,57,58,5,41,0,0,58,14,
        1,0,0,0,59,60,5,42,0,0,60,16,1,0,0,0,61,62,5,47,0,0,62,18,1,0,0,
        0,63,64,5,43,0,0,64,20,1,0,0,0,65,66,5,45,0,0,66,22,1,0,0,0,67,68,
        5,38,0,0,68,24,1,0,0,0,69,73,7,0,0,0,70,72,7,1,0,0,71,70,1,0,0,0,
        72,75,1,0,0,0,73,71,1,0,0,0,73,74,1,0,0,0,74,26,1,0,0,0,75,73,1,
        0,0,0,76,78,7,2,0,0,77,76,1,0,0,0,78,79,1,0,0,0,79,77,1,0,0,0,79,
        80,1,0,0,0,80,28,1,0,0,0,81,82,5,109,0,0,82,83,5,117,0,0,83,84,5,
        116,0,0,84,30,1,0,0,0,85,87,7,3,0,0,86,85,1,0,0,0,87,88,1,0,0,0,
        88,86,1,0,0,0,88,89,1,0,0,0,89,90,1,0,0,0,90,91,6,15,0,0,91,32,1,
        0,0,0,4,0,73,79,88,1,6,0,0
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!SimpleLangLexer.__ATN) {
            SimpleLangLexer.__ATN = new antlr.ATNDeserializer().deserialize(SimpleLangLexer._serializedATN);
        }

        return SimpleLangLexer.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(SimpleLangLexer.literalNames, SimpleLangLexer.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return SimpleLangLexer.vocabulary;
    }

    private static readonly decisionsToDFA = SimpleLangLexer._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}