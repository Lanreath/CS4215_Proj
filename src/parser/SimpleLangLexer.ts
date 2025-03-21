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
    public static readonly IDENTIFIER = 11;
    public static readonly INT = 12;
    public static readonly WS = 13;

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

    public static readonly literalNames = [
        null, "'const'", "'='", "';'", "'print'", "'('", "')'", "'*'", "'/'", 
        "'+'", "'-'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        "IDENTIFIER", "INT", "WS"
    ];

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", 
        "T__8", "T__9", "IDENTIFIER", "INT", "WS",
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
        4,0,13,74,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,
        6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,1,0,
        1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,3,1,4,
        1,4,1,5,1,5,1,6,1,6,1,7,1,7,1,8,1,8,1,9,1,9,1,10,1,10,5,10,58,8,
        10,10,10,12,10,61,9,10,1,11,4,11,64,8,11,11,11,12,11,65,1,12,4,12,
        69,8,12,11,12,12,12,70,1,12,1,12,0,0,13,1,1,3,2,5,3,7,4,9,5,11,6,
        13,7,15,8,17,9,19,10,21,11,23,12,25,13,1,0,4,3,0,65,90,95,95,97,
        122,4,0,48,57,65,90,95,95,97,122,1,0,48,57,3,0,9,10,13,13,32,32,
        76,0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,
        11,1,0,0,0,0,13,1,0,0,0,0,15,1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,
        21,1,0,0,0,0,23,1,0,0,0,0,25,1,0,0,0,1,27,1,0,0,0,3,33,1,0,0,0,5,
        35,1,0,0,0,7,37,1,0,0,0,9,43,1,0,0,0,11,45,1,0,0,0,13,47,1,0,0,0,
        15,49,1,0,0,0,17,51,1,0,0,0,19,53,1,0,0,0,21,55,1,0,0,0,23,63,1,
        0,0,0,25,68,1,0,0,0,27,28,5,99,0,0,28,29,5,111,0,0,29,30,5,110,0,
        0,30,31,5,115,0,0,31,32,5,116,0,0,32,2,1,0,0,0,33,34,5,61,0,0,34,
        4,1,0,0,0,35,36,5,59,0,0,36,6,1,0,0,0,37,38,5,112,0,0,38,39,5,114,
        0,0,39,40,5,105,0,0,40,41,5,110,0,0,41,42,5,116,0,0,42,8,1,0,0,0,
        43,44,5,40,0,0,44,10,1,0,0,0,45,46,5,41,0,0,46,12,1,0,0,0,47,48,
        5,42,0,0,48,14,1,0,0,0,49,50,5,47,0,0,50,16,1,0,0,0,51,52,5,43,0,
        0,52,18,1,0,0,0,53,54,5,45,0,0,54,20,1,0,0,0,55,59,7,0,0,0,56,58,
        7,1,0,0,57,56,1,0,0,0,58,61,1,0,0,0,59,57,1,0,0,0,59,60,1,0,0,0,
        60,22,1,0,0,0,61,59,1,0,0,0,62,64,7,2,0,0,63,62,1,0,0,0,64,65,1,
        0,0,0,65,63,1,0,0,0,65,66,1,0,0,0,66,24,1,0,0,0,67,69,7,3,0,0,68,
        67,1,0,0,0,69,70,1,0,0,0,70,68,1,0,0,0,70,71,1,0,0,0,71,72,1,0,0,
        0,72,73,6,12,0,0,73,26,1,0,0,0,4,0,59,65,70,1,6,0,0
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