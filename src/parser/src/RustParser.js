// Generated from src/Rust.g4 by ANTLR 4.13.1
import * as antlr from "antlr4ng";
export class RustParser extends antlr.Parser {
    get grammarFileName() { return "Rust.g4"; }
    get literalNames() { return RustParser.literalNames; }
    get symbolicNames() { return RustParser.symbolicNames; }
    get ruleNames() { return RustParser.ruleNames; }
    get serializedATN() { return RustParser._serializedATN; }
    createFailedPredicateException(predicate, message) {
        return new antlr.FailedPredicateException(this, predicate, message);
    }
    constructor(input) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, RustParser._ATN, RustParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    prog() {
        let localContext = new ProgContext(this.context, this.state);
        this.enterRule(localContext, 0, RustParser.RULE_prog);
        let _la;
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 33;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 101230786) !== 0)) {
                    {
                        {
                            this.state = 30;
                            this.statement();
                        }
                    }
                    this.state = 35;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 36;
                this.match(RustParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    statement() {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 2, RustParser.RULE_statement);
        try {
            this.state = 45;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context)) {
                case 1:
                    this.enterOuterAlt(localContext, 1);
                    {
                        this.state = 38;
                        this.variableDeclaration();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(localContext, 2);
                    {
                        this.state = 39;
                        this.functionDeclaration();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(localContext, 3);
                    {
                        this.state = 40;
                        this.assignment();
                    }
                    break;
                case 4:
                    this.enterOuterAlt(localContext, 4);
                    {
                        this.state = 41;
                        this.block();
                    }
                    break;
                case 5:
                    this.enterOuterAlt(localContext, 5);
                    {
                        this.state = 42;
                        this.ifStatement();
                    }
                    break;
                case 6:
                    this.enterOuterAlt(localContext, 6);
                    {
                        this.state = 43;
                        this.whileLoop();
                    }
                    break;
                case 7:
                    this.enterOuterAlt(localContext, 7);
                    {
                        this.state = 44;
                        this.expressionStatement();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    variableDeclaration() {
        let localContext = new VariableDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 4, RustParser.RULE_variableDeclaration);
        let _la;
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 47;
                this.match(RustParser.T__0);
                this.state = 49;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 2) {
                    {
                        this.state = 48;
                        localContext._mutFlag = this.match(RustParser.T__1);
                    }
                }
                this.state = 51;
                localContext._name = this.match(RustParser.IDENTIFIER);
                this.state = 52;
                this.match(RustParser.T__2);
                this.state = 53;
                this.type_();
                this.state = 54;
                this.match(RustParser.T__3);
                this.state = 55;
                localContext._value = this.expression(0);
                this.state = 56;
                this.match(RustParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    functionDeclaration() {
        let localContext = new FunctionDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 6, RustParser.RULE_functionDeclaration);
        let _la;
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 58;
                this.match(RustParser.T__5);
                this.state = 59;
                localContext._name = this.match(RustParser.IDENTIFIER);
                this.state = 60;
                this.match(RustParser.T__6);
                this.state = 62;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 25) {
                    {
                        this.state = 61;
                        this.paramList();
                    }
                }
                this.state = 64;
                this.match(RustParser.T__7);
                this.state = 65;
                this.match(RustParser.T__8);
                this.state = 66;
                localContext._returnType = this.type_();
                this.state = 67;
                localContext._functionBody = this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    paramList() {
        let localContext = new ParamListContext(this.context, this.state);
        this.enterRule(localContext, 8, RustParser.RULE_paramList);
        let _la;
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 69;
                this.param();
                this.state = 74;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 10) {
                    {
                        {
                            this.state = 70;
                            this.match(RustParser.T__9);
                            this.state = 71;
                            this.param();
                        }
                    }
                    this.state = 76;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    param() {
        let localContext = new ParamContext(this.context, this.state);
        this.enterRule(localContext, 10, RustParser.RULE_param);
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 77;
                localContext._name = this.match(RustParser.IDENTIFIER);
                this.state = 78;
                this.match(RustParser.T__2);
                this.state = 79;
                this.type_();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    block() {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 12, RustParser.RULE_block);
        let _la;
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 81;
                this.match(RustParser.T__10);
                this.state = 85;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 101230786) !== 0)) {
                    {
                        {
                            this.state = 82;
                            this.statement();
                        }
                    }
                    this.state = 87;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 88;
                this.match(RustParser.T__11);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    ifStatement() {
        let localContext = new IfStatementContext(this.context, this.state);
        this.enterRule(localContext, 14, RustParser.RULE_ifStatement);
        let _la;
        try {
            let alternative;
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 90;
                this.match(RustParser.T__12);
                this.state = 91;
                localContext._condition = this.expression(0);
                this.state = 92;
                localContext._thenBlock = this.block();
                this.state = 96;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        {
                            {
                                this.state = 93;
                                this.elifBranch();
                            }
                        }
                    }
                    this.state = 98;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
                }
                this.state = 100;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 14) {
                    {
                        this.state = 99;
                        this.elseBranch();
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    elifBranch() {
        let localContext = new ElifBranchContext(this.context, this.state);
        this.enterRule(localContext, 16, RustParser.RULE_elifBranch);
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 102;
                this.match(RustParser.T__13);
                this.state = 103;
                this.match(RustParser.T__12);
                this.state = 104;
                localContext._condition = this.expression(0);
                this.state = 105;
                localContext._thenBlock = this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    elseBranch() {
        let localContext = new ElseBranchContext(this.context, this.state);
        this.enterRule(localContext, 18, RustParser.RULE_elseBranch);
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 107;
                this.match(RustParser.T__13);
                this.state = 108;
                localContext._elseBlock = this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    whileLoop() {
        let localContext = new WhileLoopContext(this.context, this.state);
        this.enterRule(localContext, 20, RustParser.RULE_whileLoop);
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 110;
                this.match(RustParser.T__14);
                this.state = 111;
                localContext._condition = this.expression(0);
                this.state = 112;
                localContext._loopBody = this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    assignment() {
        let localContext = new AssignmentContext(this.context, this.state);
        this.enterRule(localContext, 22, RustParser.RULE_assignment);
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 114;
                this.match(RustParser.IDENTIFIER);
                this.state = 115;
                this.match(RustParser.T__3);
                this.state = 116;
                this.expression(0);
                this.state = 117;
                this.match(RustParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    expressionStatement() {
        let localContext = new ExpressionStatementContext(this.context, this.state);
        this.enterRule(localContext, 24, RustParser.RULE_expressionStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 119;
                this.expression(0);
                this.state = 120;
                this.match(RustParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    expression(_p) {
        if (_p === undefined) {
            _p = 0;
        }
        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExpressionContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 26;
        this.enterRecursionRule(localContext, 26, RustParser.RULE_expression, _p);
        let _la;
        try {
            let alternative;
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 131;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                    case RustParser.T__6:
                        {
                            localContext = new ParenExprContext(localContext);
                            this.context = localContext;
                            previousContext = localContext;
                            this.state = 123;
                            this.match(RustParser.T__6);
                            this.state = 124;
                            this.expression(0);
                            this.state = 125;
                            this.match(RustParser.T__7);
                        }
                        break;
                    case RustParser.T__18:
                        {
                            localContext = new UnaryOpContext(localContext);
                            this.context = localContext;
                            previousContext = localContext;
                            this.state = 127;
                            this.match(RustParser.T__18);
                            this.state = 128;
                            localContext._operand = this.expression(3);
                        }
                        break;
                    case RustParser.IDENTIFIER:
                        {
                            localContext = new IdentifierContext(localContext);
                            this.context = localContext;
                            previousContext = localContext;
                            this.state = 129;
                            this.match(RustParser.IDENTIFIER);
                        }
                        break;
                    case RustParser.INT:
                        {
                            localContext = new IntContext(localContext);
                            this.context = localContext;
                            previousContext = localContext;
                            this.state = 130;
                            this.match(RustParser.INT);
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                }
                this.context.stop = this.tokenStream.LT(-1);
                this.state = 138;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 9, this.context);
                while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                    if (alternative === 1) {
                        if (this.parseListeners != null) {
                            this.triggerExitRuleEvent();
                        }
                        previousContext = localContext;
                        {
                            {
                                localContext = new BinaryOpContext(new ExpressionContext(parentContext, parentState));
                                localContext._left = previousContext;
                                this.pushNewRecursionContext(localContext, _startState, RustParser.RULE_expression);
                                this.state = 133;
                                if (!(this.precpred(this.context, 4))) {
                                    throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                                }
                                this.state = 134;
                                localContext._op = this.tokenStream.LT(1);
                                _la = this.tokenStream.LA(1);
                                if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & 16711680) !== 0))) {
                                    localContext._op = this.errorHandler.recoverInline(this);
                                }
                                else {
                                    this.errorHandler.reportMatch(this);
                                    this.consume();
                                }
                                this.state = 135;
                                localContext._right = this.expression(5);
                            }
                        }
                    }
                    this.state = 140;
                    this.errorHandler.sync(this);
                    alternative = this.interpreter.adaptivePredict(this.tokenStream, 9, this.context);
                }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    type_() {
        let localContext = new TypeContext(this.context, this.state);
        this.enterRule(localContext, 28, RustParser.RULE_type);
        try {
            this.enterOuterAlt(localContext, 1);
            {
                this.state = 141;
                this.match(RustParser.T__23);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    sempred(localContext, ruleIndex, predIndex) {
        switch (ruleIndex) {
            case 13:
                return this.expression_sempred(localContext, predIndex);
        }
        return true;
    }
    expression_sempred(localContext, predIndex) {
        switch (predIndex) {
            case 0:
                return this.precpred(this.context, 4);
        }
        return true;
    }
    static get _ATN() {
        if (!RustParser.__ATN) {
            RustParser.__ATN = new antlr.ATNDeserializer().deserialize(RustParser._serializedATN);
        }
        return RustParser.__ATN;
    }
    get vocabulary() {
        return RustParser.vocabulary;
    }
}
RustParser.T__0 = 1;
RustParser.T__1 = 2;
RustParser.T__2 = 3;
RustParser.T__3 = 4;
RustParser.T__4 = 5;
RustParser.T__5 = 6;
RustParser.T__6 = 7;
RustParser.T__7 = 8;
RustParser.T__8 = 9;
RustParser.T__9 = 10;
RustParser.T__10 = 11;
RustParser.T__11 = 12;
RustParser.T__12 = 13;
RustParser.T__13 = 14;
RustParser.T__14 = 15;
RustParser.T__15 = 16;
RustParser.T__16 = 17;
RustParser.T__17 = 18;
RustParser.T__18 = 19;
RustParser.T__19 = 20;
RustParser.T__20 = 21;
RustParser.T__21 = 22;
RustParser.T__22 = 23;
RustParser.T__23 = 24;
RustParser.IDENTIFIER = 25;
RustParser.INT = 26;
RustParser.WS = 27;
RustParser.RULE_prog = 0;
RustParser.RULE_statement = 1;
RustParser.RULE_variableDeclaration = 2;
RustParser.RULE_functionDeclaration = 3;
RustParser.RULE_paramList = 4;
RustParser.RULE_param = 5;
RustParser.RULE_block = 6;
RustParser.RULE_ifStatement = 7;
RustParser.RULE_elifBranch = 8;
RustParser.RULE_elseBranch = 9;
RustParser.RULE_whileLoop = 10;
RustParser.RULE_assignment = 11;
RustParser.RULE_expressionStatement = 12;
RustParser.RULE_expression = 13;
RustParser.RULE_type = 14;
RustParser.literalNames = [
    null, "'let'", "'mut'", "':'", "'='", "';'", "'fn'", "'('", "')'",
    "'->'", "','", "'{'", "'}'", "'if'", "'else'", "'while'", "'*'",
    "'/'", "'+'", "'-'", "'>'", "'<'", "'=='", "'!='", "'i64'"
];
RustParser.symbolicNames = [
    null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, "IDENTIFIER", "INT", "WS"
];
RustParser.ruleNames = [
    "prog", "statement", "variableDeclaration", "functionDeclaration",
    "paramList", "param", "block", "ifStatement", "elifBranch", "elseBranch",
    "whileLoop", "assignment", "expressionStatement", "expression",
    "type",
];
RustParser._serializedATN = [
    4, 1, 27, 144, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4, 7, 4, 2, 5, 7, 5, 2, 6, 7,
    6, 2, 7, 7, 7, 2, 8, 7, 8, 2, 9, 7, 9, 2, 10, 7, 10, 2, 11, 7, 11, 2, 12, 7, 12, 2, 13, 7, 13,
    2, 14, 7, 14, 1, 0, 5, 0, 32, 8, 0, 10, 0, 12, 0, 35, 9, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 3, 1, 46, 8, 1, 1, 2, 1, 2, 3, 2, 50, 8, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
    1, 2, 1, 2, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 63, 8, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1, 4, 1,
    4, 5, 4, 73, 8, 4, 10, 4, 12, 4, 76, 9, 4, 1, 5, 1, 5, 1, 5, 1, 5, 1, 6, 1, 6, 5, 6, 84, 8, 6,
    10, 6, 12, 6, 87, 9, 6, 1, 6, 1, 6, 1, 7, 1, 7, 1, 7, 1, 7, 5, 7, 95, 8, 7, 10, 7, 12, 7, 98,
    9, 7, 1, 7, 3, 7, 101, 8, 7, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 9, 1, 9, 1, 9, 1, 10, 1, 10, 1,
    10, 1, 10, 1, 11, 1, 11, 1, 11, 1, 11, 1, 11, 1, 12, 1, 12, 1, 12, 1, 13, 1, 13, 1, 13, 1,
    13, 1, 13, 1, 13, 1, 13, 1, 13, 1, 13, 3, 13, 132, 8, 13, 1, 13, 1, 13, 1, 13, 5, 13, 137,
    8, 13, 10, 13, 12, 13, 140, 9, 13, 1, 14, 1, 14, 1, 14, 0, 1, 26, 15, 0, 2, 4, 6, 8, 10,
    12, 14, 16, 18, 20, 22, 24, 26, 28, 0, 1, 1, 0, 16, 23, 145, 0, 33, 1, 0, 0, 0, 2, 45, 1,
    0, 0, 0, 4, 47, 1, 0, 0, 0, 6, 58, 1, 0, 0, 0, 8, 69, 1, 0, 0, 0, 10, 77, 1, 0, 0, 0, 12, 81,
    1, 0, 0, 0, 14, 90, 1, 0, 0, 0, 16, 102, 1, 0, 0, 0, 18, 107, 1, 0, 0, 0, 20, 110, 1, 0, 0,
    0, 22, 114, 1, 0, 0, 0, 24, 119, 1, 0, 0, 0, 26, 131, 1, 0, 0, 0, 28, 141, 1, 0, 0, 0, 30,
    32, 3, 2, 1, 0, 31, 30, 1, 0, 0, 0, 32, 35, 1, 0, 0, 0, 33, 31, 1, 0, 0, 0, 33, 34, 1, 0, 0,
    0, 34, 36, 1, 0, 0, 0, 35, 33, 1, 0, 0, 0, 36, 37, 5, 0, 0, 1, 37, 1, 1, 0, 0, 0, 38, 46, 3,
    4, 2, 0, 39, 46, 3, 6, 3, 0, 40, 46, 3, 22, 11, 0, 41, 46, 3, 12, 6, 0, 42, 46, 3, 14, 7,
    0, 43, 46, 3, 20, 10, 0, 44, 46, 3, 24, 12, 0, 45, 38, 1, 0, 0, 0, 45, 39, 1, 0, 0, 0, 45,
    40, 1, 0, 0, 0, 45, 41, 1, 0, 0, 0, 45, 42, 1, 0, 0, 0, 45, 43, 1, 0, 0, 0, 45, 44, 1, 0, 0,
    0, 46, 3, 1, 0, 0, 0, 47, 49, 5, 1, 0, 0, 48, 50, 5, 2, 0, 0, 49, 48, 1, 0, 0, 0, 49, 50, 1,
    0, 0, 0, 50, 51, 1, 0, 0, 0, 51, 52, 5, 25, 0, 0, 52, 53, 5, 3, 0, 0, 53, 54, 3, 28, 14, 0,
    54, 55, 5, 4, 0, 0, 55, 56, 3, 26, 13, 0, 56, 57, 5, 5, 0, 0, 57, 5, 1, 0, 0, 0, 58, 59, 5,
    6, 0, 0, 59, 60, 5, 25, 0, 0, 60, 62, 5, 7, 0, 0, 61, 63, 3, 8, 4, 0, 62, 61, 1, 0, 0, 0, 62,
    63, 1, 0, 0, 0, 63, 64, 1, 0, 0, 0, 64, 65, 5, 8, 0, 0, 65, 66, 5, 9, 0, 0, 66, 67, 3, 28,
    14, 0, 67, 68, 3, 12, 6, 0, 68, 7, 1, 0, 0, 0, 69, 74, 3, 10, 5, 0, 70, 71, 5, 10, 0, 0, 71,
    73, 3, 10, 5, 0, 72, 70, 1, 0, 0, 0, 73, 76, 1, 0, 0, 0, 74, 72, 1, 0, 0, 0, 74, 75, 1, 0,
    0, 0, 75, 9, 1, 0, 0, 0, 76, 74, 1, 0, 0, 0, 77, 78, 5, 25, 0, 0, 78, 79, 5, 3, 0, 0, 79, 80,
    3, 28, 14, 0, 80, 11, 1, 0, 0, 0, 81, 85, 5, 11, 0, 0, 82, 84, 3, 2, 1, 0, 83, 82, 1, 0, 0,
    0, 84, 87, 1, 0, 0, 0, 85, 83, 1, 0, 0, 0, 85, 86, 1, 0, 0, 0, 86, 88, 1, 0, 0, 0, 87, 85,
    1, 0, 0, 0, 88, 89, 5, 12, 0, 0, 89, 13, 1, 0, 0, 0, 90, 91, 5, 13, 0, 0, 91, 92, 3, 26, 13,
    0, 92, 96, 3, 12, 6, 0, 93, 95, 3, 16, 8, 0, 94, 93, 1, 0, 0, 0, 95, 98, 1, 0, 0, 0, 96, 94,
    1, 0, 0, 0, 96, 97, 1, 0, 0, 0, 97, 100, 1, 0, 0, 0, 98, 96, 1, 0, 0, 0, 99, 101, 3, 18, 9,
    0, 100, 99, 1, 0, 0, 0, 100, 101, 1, 0, 0, 0, 101, 15, 1, 0, 0, 0, 102, 103, 5, 14, 0, 0,
    103, 104, 5, 13, 0, 0, 104, 105, 3, 26, 13, 0, 105, 106, 3, 12, 6, 0, 106, 17, 1, 0, 0,
    0, 107, 108, 5, 14, 0, 0, 108, 109, 3, 12, 6, 0, 109, 19, 1, 0, 0, 0, 110, 111, 5, 15,
    0, 0, 111, 112, 3, 26, 13, 0, 112, 113, 3, 12, 6, 0, 113, 21, 1, 0, 0, 0, 114, 115, 5,
    25, 0, 0, 115, 116, 5, 4, 0, 0, 116, 117, 3, 26, 13, 0, 117, 118, 5, 5, 0, 0, 118, 23,
    1, 0, 0, 0, 119, 120, 3, 26, 13, 0, 120, 121, 5, 5, 0, 0, 121, 25, 1, 0, 0, 0, 122, 123,
    6, 13, -1, 0, 123, 124, 5, 7, 0, 0, 124, 125, 3, 26, 13, 0, 125, 126, 5, 8, 0, 0, 126,
    132, 1, 0, 0, 0, 127, 128, 5, 19, 0, 0, 128, 132, 3, 26, 13, 3, 129, 132, 5, 25, 0, 0,
    130, 132, 5, 26, 0, 0, 131, 122, 1, 0, 0, 0, 131, 127, 1, 0, 0, 0, 131, 129, 1, 0, 0, 0,
    131, 130, 1, 0, 0, 0, 132, 138, 1, 0, 0, 0, 133, 134, 10, 4, 0, 0, 134, 135, 7, 0, 0, 0,
    135, 137, 3, 26, 13, 5, 136, 133, 1, 0, 0, 0, 137, 140, 1, 0, 0, 0, 138, 136, 1, 0, 0,
    0, 138, 139, 1, 0, 0, 0, 139, 27, 1, 0, 0, 0, 140, 138, 1, 0, 0, 0, 141, 142, 5, 24, 0,
    0, 142, 29, 1, 0, 0, 0, 10, 33, 45, 49, 62, 74, 85, 96, 100, 131, 138
];
RustParser.vocabulary = new antlr.Vocabulary(RustParser.literalNames, RustParser.symbolicNames, []);
RustParser.decisionsToDFA = RustParser._ATN.decisionToState.map((ds, index) => new antlr.DFA(ds, index));
export class ProgContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    EOF() {
        return this.getToken(RustParser.EOF, 0);
    }
    statement(i) {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }
        return this.getRuleContext(i, StatementContext);
    }
    get ruleIndex() {
        return RustParser.RULE_prog;
    }
    enterRule(listener) {
        if (listener.enterProg) {
            listener.enterProg(this);
        }
    }
    exitRule(listener) {
        if (listener.exitProg) {
            listener.exitProg(this);
        }
    }
    accept(visitor) {
        if (visitor.visitProg) {
            return visitor.visitProg(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class StatementContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    variableDeclaration() {
        return this.getRuleContext(0, VariableDeclarationContext);
    }
    functionDeclaration() {
        return this.getRuleContext(0, FunctionDeclarationContext);
    }
    assignment() {
        return this.getRuleContext(0, AssignmentContext);
    }
    block() {
        return this.getRuleContext(0, BlockContext);
    }
    ifStatement() {
        return this.getRuleContext(0, IfStatementContext);
    }
    whileLoop() {
        return this.getRuleContext(0, WhileLoopContext);
    }
    expressionStatement() {
        return this.getRuleContext(0, ExpressionStatementContext);
    }
    get ruleIndex() {
        return RustParser.RULE_statement;
    }
    enterRule(listener) {
        if (listener.enterStatement) {
            listener.enterStatement(this);
        }
    }
    exitRule(listener) {
        if (listener.exitStatement) {
            listener.exitStatement(this);
        }
    }
    accept(visitor) {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class VariableDeclarationContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    type() {
        return this.getRuleContext(0, TypeContext);
    }
    IDENTIFIER() {
        return this.getToken(RustParser.IDENTIFIER, 0);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    get ruleIndex() {
        return RustParser.RULE_variableDeclaration;
    }
    enterRule(listener) {
        if (listener.enterVariableDeclaration) {
            listener.enterVariableDeclaration(this);
        }
    }
    exitRule(listener) {
        if (listener.exitVariableDeclaration) {
            listener.exitVariableDeclaration(this);
        }
    }
    accept(visitor) {
        if (visitor.visitVariableDeclaration) {
            return visitor.visitVariableDeclaration(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class FunctionDeclarationContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    IDENTIFIER() {
        return this.getToken(RustParser.IDENTIFIER, 0);
    }
    type() {
        return this.getRuleContext(0, TypeContext);
    }
    block() {
        return this.getRuleContext(0, BlockContext);
    }
    paramList() {
        return this.getRuleContext(0, ParamListContext);
    }
    get ruleIndex() {
        return RustParser.RULE_functionDeclaration;
    }
    enterRule(listener) {
        if (listener.enterFunctionDeclaration) {
            listener.enterFunctionDeclaration(this);
        }
    }
    exitRule(listener) {
        if (listener.exitFunctionDeclaration) {
            listener.exitFunctionDeclaration(this);
        }
    }
    accept(visitor) {
        if (visitor.visitFunctionDeclaration) {
            return visitor.visitFunctionDeclaration(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamListContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    param(i) {
        if (i === undefined) {
            return this.getRuleContexts(ParamContext);
        }
        return this.getRuleContext(i, ParamContext);
    }
    get ruleIndex() {
        return RustParser.RULE_paramList;
    }
    enterRule(listener) {
        if (listener.enterParamList) {
            listener.enterParamList(this);
        }
    }
    exitRule(listener) {
        if (listener.exitParamList) {
            listener.exitParamList(this);
        }
    }
    accept(visitor) {
        if (visitor.visitParamList) {
            return visitor.visitParamList(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParamContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    type() {
        return this.getRuleContext(0, TypeContext);
    }
    IDENTIFIER() {
        return this.getToken(RustParser.IDENTIFIER, 0);
    }
    get ruleIndex() {
        return RustParser.RULE_param;
    }
    enterRule(listener) {
        if (listener.enterParam) {
            listener.enterParam(this);
        }
    }
    exitRule(listener) {
        if (listener.exitParam) {
            listener.exitParam(this);
        }
    }
    accept(visitor) {
        if (visitor.visitParam) {
            return visitor.visitParam(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class BlockContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    statement(i) {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }
        return this.getRuleContext(i, StatementContext);
    }
    get ruleIndex() {
        return RustParser.RULE_block;
    }
    enterRule(listener) {
        if (listener.enterBlock) {
            listener.enterBlock(this);
        }
    }
    exitRule(listener) {
        if (listener.exitBlock) {
            listener.exitBlock(this);
        }
    }
    accept(visitor) {
        if (visitor.visitBlock) {
            return visitor.visitBlock(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class IfStatementContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    block() {
        return this.getRuleContext(0, BlockContext);
    }
    elifBranch(i) {
        if (i === undefined) {
            return this.getRuleContexts(ElifBranchContext);
        }
        return this.getRuleContext(i, ElifBranchContext);
    }
    elseBranch() {
        return this.getRuleContext(0, ElseBranchContext);
    }
    get ruleIndex() {
        return RustParser.RULE_ifStatement;
    }
    enterRule(listener) {
        if (listener.enterIfStatement) {
            listener.enterIfStatement(this);
        }
    }
    exitRule(listener) {
        if (listener.exitIfStatement) {
            listener.exitIfStatement(this);
        }
    }
    accept(visitor) {
        if (visitor.visitIfStatement) {
            return visitor.visitIfStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ElifBranchContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    block() {
        return this.getRuleContext(0, BlockContext);
    }
    get ruleIndex() {
        return RustParser.RULE_elifBranch;
    }
    enterRule(listener) {
        if (listener.enterElifBranch) {
            listener.enterElifBranch(this);
        }
    }
    exitRule(listener) {
        if (listener.exitElifBranch) {
            listener.exitElifBranch(this);
        }
    }
    accept(visitor) {
        if (visitor.visitElifBranch) {
            return visitor.visitElifBranch(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ElseBranchContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    block() {
        return this.getRuleContext(0, BlockContext);
    }
    get ruleIndex() {
        return RustParser.RULE_elseBranch;
    }
    enterRule(listener) {
        if (listener.enterElseBranch) {
            listener.enterElseBranch(this);
        }
    }
    exitRule(listener) {
        if (listener.exitElseBranch) {
            listener.exitElseBranch(this);
        }
    }
    accept(visitor) {
        if (visitor.visitElseBranch) {
            return visitor.visitElseBranch(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class WhileLoopContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    block() {
        return this.getRuleContext(0, BlockContext);
    }
    get ruleIndex() {
        return RustParser.RULE_whileLoop;
    }
    enterRule(listener) {
        if (listener.enterWhileLoop) {
            listener.enterWhileLoop(this);
        }
    }
    exitRule(listener) {
        if (listener.exitWhileLoop) {
            listener.exitWhileLoop(this);
        }
    }
    accept(visitor) {
        if (visitor.visitWhileLoop) {
            return visitor.visitWhileLoop(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class AssignmentContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    IDENTIFIER() {
        return this.getToken(RustParser.IDENTIFIER, 0);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    get ruleIndex() {
        return RustParser.RULE_assignment;
    }
    enterRule(listener) {
        if (listener.enterAssignment) {
            listener.enterAssignment(this);
        }
    }
    exitRule(listener) {
        if (listener.exitAssignment) {
            listener.exitAssignment(this);
        }
    }
    accept(visitor) {
        if (visitor.visitAssignment) {
            return visitor.visitAssignment(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ExpressionStatementContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    get ruleIndex() {
        return RustParser.RULE_expressionStatement;
    }
    enterRule(listener) {
        if (listener.enterExpressionStatement) {
            listener.enterExpressionStatement(this);
        }
    }
    exitRule(listener) {
        if (listener.exitExpressionStatement) {
            listener.exitExpressionStatement(this);
        }
    }
    accept(visitor) {
        if (visitor.visitExpressionStatement) {
            return visitor.visitExpressionStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ExpressionContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    get ruleIndex() {
        return RustParser.RULE_expression;
    }
    copyFrom(ctx) {
        super.copyFrom(ctx);
    }
}
export class IdentifierContext extends ExpressionContext {
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    IDENTIFIER() {
        return this.getToken(RustParser.IDENTIFIER, 0);
    }
    enterRule(listener) {
        if (listener.enterIdentifier) {
            listener.enterIdentifier(this);
        }
    }
    exitRule(listener) {
        if (listener.exitIdentifier) {
            listener.exitIdentifier(this);
        }
    }
    accept(visitor) {
        if (visitor.visitIdentifier) {
            return visitor.visitIdentifier(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class BinaryOpContext extends ExpressionContext {
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        return this.getRuleContext(i, ExpressionContext);
    }
    enterRule(listener) {
        if (listener.enterBinaryOp) {
            listener.enterBinaryOp(this);
        }
    }
    exitRule(listener) {
        if (listener.exitBinaryOp) {
            listener.exitBinaryOp(this);
        }
    }
    accept(visitor) {
        if (visitor.visitBinaryOp) {
            return visitor.visitBinaryOp(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class UnaryOpContext extends ExpressionContext {
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    enterRule(listener) {
        if (listener.enterUnaryOp) {
            listener.enterUnaryOp(this);
        }
    }
    exitRule(listener) {
        if (listener.exitUnaryOp) {
            listener.exitUnaryOp(this);
        }
    }
    accept(visitor) {
        if (visitor.visitUnaryOp) {
            return visitor.visitUnaryOp(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParenExprContext extends ExpressionContext {
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    enterRule(listener) {
        if (listener.enterParenExpr) {
            listener.enterParenExpr(this);
        }
    }
    exitRule(listener) {
        if (listener.exitParenExpr) {
            listener.exitParenExpr(this);
        }
    }
    accept(visitor) {
        if (visitor.visitParenExpr) {
            return visitor.visitParenExpr(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class IntContext extends ExpressionContext {
    constructor(ctx) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    INT() {
        return this.getToken(RustParser.INT, 0);
    }
    enterRule(listener) {
        if (listener.enterInt) {
            listener.enterInt(this);
        }
    }
    exitRule(listener) {
        if (listener.exitInt) {
            listener.exitInt(this);
        }
    }
    accept(visitor) {
        if (visitor.visitInt) {
            return visitor.visitInt(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
export class TypeContext extends antlr.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    get ruleIndex() {
        return RustParser.RULE_type;
    }
    enterRule(listener) {
        if (listener.enterType) {
            listener.enterType(this);
        }
    }
    exitRule(listener) {
        if (listener.exitType) {
            listener.exitType(this);
        }
    }
    accept(visitor) {
        if (visitor.visitType) {
            return visitor.visitType(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
