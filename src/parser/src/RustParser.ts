// Generated from src/Rust.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { RustListener } from "./RustListener.js";
import { RustVisitor } from "./RustVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class RustParser extends antlr.Parser {
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
    public static readonly T__28 = 29;
    public static readonly IDENTIFIER = 30;
    public static readonly INT = 31;
    public static readonly WS = 32;
    public static readonly RULE_prog = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_returnStatement = 2;
    public static readonly RULE_variableDeclaration = 3;
    public static readonly RULE_functionDeclaration = 4;
    public static readonly RULE_paramList = 5;
    public static readonly RULE_param = 6;
    public static readonly RULE_block = 7;
    public static readonly RULE_ifStatement = 8;
    public static readonly RULE_elseBranch = 9;
    public static readonly RULE_whileStatement = 10;
    public static readonly RULE_assignment = 11;
    public static readonly RULE_expressionStatement = 12;
    public static readonly RULE_expression = 13;
    public static readonly RULE_argList = 14;
    public static readonly RULE_type = 15;
    public static readonly RULE_breakStatement = 16;

    public static readonly literalNames = [
        null, "'return'", "';'", "'let'", "'mut'", "':'", "'='", "'fn'", 
        "'('", "')'", "'->'", "','", "'{'", "'}'", "'if'", "'else'", "'while'", 
        "'*'", "'&'", "'>'", "'>='", "'<'", "'<='", "'=='", "'!='", "'/'", 
        "'+'", "'-'", "'i64'", "'break'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, "IDENTIFIER", "INT", 
        "WS"
    ];
    public static readonly ruleNames = [
        "prog", "statement", "returnStatement", "variableDeclaration", "functionDeclaration", 
        "paramList", "param", "block", "ifStatement", "elseBranch", "whileStatement", 
        "assignment", "expressionStatement", "expression", "argList", "type", 
        "breakStatement",
    ];

    public get grammarFileName(): string { return "Rust.g4"; }
    public get literalNames(): (string | null)[] { return RustParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return RustParser.symbolicNames; }
    public get ruleNames(): string[] { return RustParser.ruleNames; }
    public get serializedATN(): number[] { return RustParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, RustParser._ATN, RustParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public prog(): ProgContext {
        let localContext = new ProgContext(this.context, this.state);
        this.enterRule(localContext, 0, RustParser.RULE_prog);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 37;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3892793738) !== 0)) {
                {
                {
                this.state = 34;
                this.statement();
                }
                }
                this.state = 39;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 40;
            this.match(RustParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 2, RustParser.RULE_statement);
        try {
            this.state = 51;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 42;
                this.variableDeclaration();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 43;
                this.functionDeclaration();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 44;
                this.assignment();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 45;
                this.block();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 46;
                this.ifStatement();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 47;
                this.whileStatement();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 48;
                this.returnStatement();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 49;
                this.breakStatement();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 50;
                this.expressionStatement();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public returnStatement(): ReturnStatementContext {
        let localContext = new ReturnStatementContext(this.context, this.state);
        this.enterRule(localContext, 4, RustParser.RULE_returnStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 53;
            this.match(RustParser.T__0);
            this.state = 55;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3355836672) !== 0)) {
                {
                this.state = 54;
                this.expression(0);
                }
            }

            this.state = 57;
            this.match(RustParser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableDeclaration(): VariableDeclarationContext {
        let localContext = new VariableDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 6, RustParser.RULE_variableDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 59;
            this.match(RustParser.T__2);
            this.state = 61;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 4) {
                {
                this.state = 60;
                localContext._mutFlag = this.match(RustParser.T__3);
                }
            }

            this.state = 63;
            localContext._name = this.match(RustParser.IDENTIFIER);
            this.state = 64;
            this.match(RustParser.T__4);
            this.state = 65;
            this.type_();
            this.state = 66;
            this.match(RustParser.T__5);
            this.state = 67;
            localContext._value = this.expression(0);
            this.state = 68;
            this.match(RustParser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public functionDeclaration(): FunctionDeclarationContext {
        let localContext = new FunctionDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 8, RustParser.RULE_functionDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 70;
            this.match(RustParser.T__6);
            this.state = 71;
            localContext._name = this.match(RustParser.IDENTIFIER);
            this.state = 72;
            this.match(RustParser.T__7);
            this.state = 74;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 73;
                this.paramList();
                }
            }

            this.state = 76;
            this.match(RustParser.T__8);
            this.state = 77;
            this.match(RustParser.T__9);
            this.state = 78;
            localContext._returnType = this.type_();
            this.state = 79;
            localContext._functionBody = this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public paramList(): ParamListContext {
        let localContext = new ParamListContext(this.context, this.state);
        this.enterRule(localContext, 10, RustParser.RULE_paramList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 81;
            this.param();
            this.state = 86;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 11) {
                {
                {
                this.state = 82;
                this.match(RustParser.T__10);
                this.state = 83;
                this.param();
                }
                }
                this.state = 88;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public param(): ParamContext {
        let localContext = new ParamContext(this.context, this.state);
        this.enterRule(localContext, 12, RustParser.RULE_param);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 89;
            localContext._name = this.match(RustParser.IDENTIFIER);
            this.state = 90;
            this.match(RustParser.T__4);
            this.state = 91;
            this.type_();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public block(): BlockContext {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 14, RustParser.RULE_block);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 93;
            this.match(RustParser.T__11);
            this.state = 97;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 94;
                    this.statement();
                    }
                    }
                }
                this.state = 99;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
            }
            this.state = 101;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3355836672) !== 0)) {
                {
                this.state = 100;
                this.expression(0);
                }
            }

            this.state = 103;
            this.match(RustParser.T__12);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifStatement(): IfStatementContext {
        let localContext = new IfStatementContext(this.context, this.state);
        this.enterRule(localContext, 16, RustParser.RULE_ifStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 105;
            this.match(RustParser.T__13);
            this.state = 106;
            localContext._condition = this.expression(0);
            this.state = 107;
            localContext._thenBlock = this.block();
            this.state = 109;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 15) {
                {
                this.state = 108;
                this.elseBranch();
                }
            }

            this.state = 111;
            this.match(RustParser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elseBranch(): ElseBranchContext {
        let localContext = new ElseBranchContext(this.context, this.state);
        this.enterRule(localContext, 18, RustParser.RULE_elseBranch);
        try {
            this.state = 117;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 9, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 113;
                this.match(RustParser.T__14);
                this.state = 114;
                this.block();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 115;
                this.match(RustParser.T__14);
                this.state = 116;
                this.ifStatement();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whileStatement(): WhileStatementContext {
        let localContext = new WhileStatementContext(this.context, this.state);
        this.enterRule(localContext, 20, RustParser.RULE_whileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 119;
            this.match(RustParser.T__15);
            this.state = 120;
            localContext._condition = this.expression(0);
            this.state = 121;
            localContext._loopBlock = this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assignment(): AssignmentContext {
        let localContext = new AssignmentContext(this.context, this.state);
        this.enterRule(localContext, 22, RustParser.RULE_assignment);
        try {
            this.state = 134;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case RustParser.IDENTIFIER:
                localContext = new StandardAssignmentContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 123;
                this.match(RustParser.IDENTIFIER);
                this.state = 124;
                this.match(RustParser.T__5);
                this.state = 125;
                this.expression(0);
                this.state = 126;
                this.match(RustParser.T__1);
                }
                break;
            case RustParser.T__16:
                localContext = new DereferenceAssignmentContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 128;
                this.match(RustParser.T__16);
                this.state = 129;
                (localContext as DereferenceAssignmentContext)._target = this.expression(0);
                this.state = 130;
                this.match(RustParser.T__5);
                this.state = 131;
                (localContext as DereferenceAssignmentContext)._value = this.expression(0);
                this.state = 132;
                this.match(RustParser.T__1);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public expressionStatement(): ExpressionStatementContext {
        let localContext = new ExpressionStatementContext(this.context, this.state);
        this.enterRule(localContext, 24, RustParser.RULE_expressionStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 136;
            this.expression(0);
            this.state = 137;
            this.match(RustParser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expression(): ExpressionContext;
    public expression(_p: number): ExpressionContext;
    public expression(_p?: number): ExpressionContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExpressionContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 26;
        this.enterRecursionRule(localContext, 26, RustParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 161;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 13, this.context) ) {
            case 1:
                {
                localContext = new ParenExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 140;
                this.match(RustParser.T__7);
                this.state = 141;
                this.expression(0);
                this.state = 142;
                this.match(RustParser.T__8);
                }
                break;
            case 2:
                {
                localContext = new ReferenceExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 144;
                this.match(RustParser.T__17);
                this.state = 146;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 4) {
                    {
                    this.state = 145;
                    this.match(RustParser.T__3);
                    }
                }

                this.state = 148;
                (localContext as ReferenceExprContext)._target = this.expression(9);
                }
                break;
            case 3:
                {
                localContext = new DereferenceExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 149;
                this.match(RustParser.T__16);
                this.state = 150;
                (localContext as DereferenceExprContext)._target = this.expression(8);
                }
                break;
            case 4:
                {
                localContext = new UnaryOpContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 151;
                this.match(RustParser.T__26);
                this.state = 152;
                (localContext as UnaryOpContext)._operand = this.expression(4);
                }
                break;
            case 5:
                {
                localContext = new FunctionCallContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 153;
                this.match(RustParser.IDENTIFIER);
                this.state = 154;
                this.match(RustParser.T__7);
                this.state = 156;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 3355836672) !== 0)) {
                    {
                    this.state = 155;
                    this.argList();
                    }
                }

                this.state = 158;
                this.match(RustParser.T__8);
                }
                break;
            case 6:
                {
                localContext = new IdentifierContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 159;
                this.match(RustParser.IDENTIFIER);
                }
                break;
            case 7:
                {
                localContext = new IntContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 160;
                this.match(RustParser.INT);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 174;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 15, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 172;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 14, this.context) ) {
                    case 1:
                        {
                        localContext = new EqualityOpContext(new ExpressionContext(parentContext, parentState));
                        (localContext as EqualityOpContext)._left = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, RustParser.RULE_expression);
                        this.state = 163;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 164;
                        (localContext as EqualityOpContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 33030144) !== 0))) {
                            (localContext as EqualityOpContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 165;
                        (localContext as EqualityOpContext)._right = this.expression(8);
                        }
                        break;
                    case 2:
                        {
                        localContext = new MulDivOpContext(new ExpressionContext(parentContext, parentState));
                        (localContext as MulDivOpContext)._left = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, RustParser.RULE_expression);
                        this.state = 166;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 167;
                        (localContext as MulDivOpContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 17 || _la === 25)) {
                            (localContext as MulDivOpContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 168;
                        (localContext as MulDivOpContext)._right = this.expression(7);
                        }
                        break;
                    case 3:
                        {
                        localContext = new AddSubOpContext(new ExpressionContext(parentContext, parentState));
                        (localContext as AddSubOpContext)._left = previousContext;
                        this.pushNewRecursionContext(localContext, _startState, RustParser.RULE_expression);
                        this.state = 169;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 170;
                        (localContext as AddSubOpContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 26 || _la === 27)) {
                            (localContext as AddSubOpContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 171;
                        (localContext as AddSubOpContext)._right = this.expression(6);
                        }
                        break;
                    }
                    }
                }
                this.state = 176;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 15, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public argList(): ArgListContext {
        let localContext = new ArgListContext(this.context, this.state);
        this.enterRule(localContext, 28, RustParser.RULE_argList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 177;
            this.expression(0);
            this.state = 182;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 11) {
                {
                {
                this.state = 178;
                this.match(RustParser.T__10);
                this.state = 179;
                this.expression(0);
                }
                }
                this.state = 184;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public type_(): TypeContext {
        let localContext = new TypeContext(this.context, this.state);
        this.enterRule(localContext, 30, RustParser.RULE_type);
        let _la: number;
        try {
            this.state = 191;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case RustParser.T__27:
                localContext = new IntegerTypeContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 185;
                this.match(RustParser.T__27);
                }
                break;
            case RustParser.T__17:
                localContext = new ReferenceTypeContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 186;
                this.match(RustParser.T__17);
                this.state = 188;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 4) {
                    {
                    this.state = 187;
                    this.match(RustParser.T__3);
                    }
                }

                this.state = 190;
                this.type_();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public breakStatement(): BreakStatementContext {
        let localContext = new BreakStatementContext(this.context, this.state);
        this.enterRule(localContext, 32, RustParser.RULE_breakStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 193;
            this.match(RustParser.T__28);
            this.state = 194;
            this.match(RustParser.T__1);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 13:
            return this.expression_sempred(localContext as ExpressionContext, predIndex);
        }
        return true;
    }
    private expression_sempred(localContext: ExpressionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 7);
        case 1:
            return this.precpred(this.context, 6);
        case 2:
            return this.precpred(this.context, 5);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,32,197,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,1,0,5,0,36,8,0,10,0,12,0,39,9,0,1,
        0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,52,8,1,1,2,1,2,3,2,
        56,8,2,1,2,1,2,1,3,1,3,3,3,62,8,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,
        4,1,4,1,4,1,4,3,4,75,8,4,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,5,5,5,85,
        8,5,10,5,12,5,88,9,5,1,6,1,6,1,6,1,6,1,7,1,7,5,7,96,8,7,10,7,12,
        7,99,9,7,1,7,3,7,102,8,7,1,7,1,7,1,8,1,8,1,8,1,8,3,8,110,8,8,1,8,
        1,8,1,9,1,9,1,9,1,9,3,9,118,8,9,1,10,1,10,1,10,1,10,1,11,1,11,1,
        11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,3,11,135,8,11,1,12,1,
        12,1,12,1,13,1,13,1,13,1,13,1,13,1,13,1,13,3,13,147,8,13,1,13,1,
        13,1,13,1,13,1,13,1,13,1,13,1,13,3,13,157,8,13,1,13,1,13,1,13,3,
        13,162,8,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,5,13,173,
        8,13,10,13,12,13,176,9,13,1,14,1,14,1,14,5,14,181,8,14,10,14,12,
        14,184,9,14,1,15,1,15,1,15,3,15,189,8,15,1,15,3,15,192,8,15,1,16,
        1,16,1,16,1,16,0,1,26,17,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,
        30,32,0,3,1,0,19,24,2,0,17,17,25,25,1,0,26,27,211,0,37,1,0,0,0,2,
        51,1,0,0,0,4,53,1,0,0,0,6,59,1,0,0,0,8,70,1,0,0,0,10,81,1,0,0,0,
        12,89,1,0,0,0,14,93,1,0,0,0,16,105,1,0,0,0,18,117,1,0,0,0,20,119,
        1,0,0,0,22,134,1,0,0,0,24,136,1,0,0,0,26,161,1,0,0,0,28,177,1,0,
        0,0,30,191,1,0,0,0,32,193,1,0,0,0,34,36,3,2,1,0,35,34,1,0,0,0,36,
        39,1,0,0,0,37,35,1,0,0,0,37,38,1,0,0,0,38,40,1,0,0,0,39,37,1,0,0,
        0,40,41,5,0,0,1,41,1,1,0,0,0,42,52,3,6,3,0,43,52,3,8,4,0,44,52,3,
        22,11,0,45,52,3,14,7,0,46,52,3,16,8,0,47,52,3,20,10,0,48,52,3,4,
        2,0,49,52,3,32,16,0,50,52,3,24,12,0,51,42,1,0,0,0,51,43,1,0,0,0,
        51,44,1,0,0,0,51,45,1,0,0,0,51,46,1,0,0,0,51,47,1,0,0,0,51,48,1,
        0,0,0,51,49,1,0,0,0,51,50,1,0,0,0,52,3,1,0,0,0,53,55,5,1,0,0,54,
        56,3,26,13,0,55,54,1,0,0,0,55,56,1,0,0,0,56,57,1,0,0,0,57,58,5,2,
        0,0,58,5,1,0,0,0,59,61,5,3,0,0,60,62,5,4,0,0,61,60,1,0,0,0,61,62,
        1,0,0,0,62,63,1,0,0,0,63,64,5,30,0,0,64,65,5,5,0,0,65,66,3,30,15,
        0,66,67,5,6,0,0,67,68,3,26,13,0,68,69,5,2,0,0,69,7,1,0,0,0,70,71,
        5,7,0,0,71,72,5,30,0,0,72,74,5,8,0,0,73,75,3,10,5,0,74,73,1,0,0,
        0,74,75,1,0,0,0,75,76,1,0,0,0,76,77,5,9,0,0,77,78,5,10,0,0,78,79,
        3,30,15,0,79,80,3,14,7,0,80,9,1,0,0,0,81,86,3,12,6,0,82,83,5,11,
        0,0,83,85,3,12,6,0,84,82,1,0,0,0,85,88,1,0,0,0,86,84,1,0,0,0,86,
        87,1,0,0,0,87,11,1,0,0,0,88,86,1,0,0,0,89,90,5,30,0,0,90,91,5,5,
        0,0,91,92,3,30,15,0,92,13,1,0,0,0,93,97,5,12,0,0,94,96,3,2,1,0,95,
        94,1,0,0,0,96,99,1,0,0,0,97,95,1,0,0,0,97,98,1,0,0,0,98,101,1,0,
        0,0,99,97,1,0,0,0,100,102,3,26,13,0,101,100,1,0,0,0,101,102,1,0,
        0,0,102,103,1,0,0,0,103,104,5,13,0,0,104,15,1,0,0,0,105,106,5,14,
        0,0,106,107,3,26,13,0,107,109,3,14,7,0,108,110,3,18,9,0,109,108,
        1,0,0,0,109,110,1,0,0,0,110,111,1,0,0,0,111,112,5,2,0,0,112,17,1,
        0,0,0,113,114,5,15,0,0,114,118,3,14,7,0,115,116,5,15,0,0,116,118,
        3,16,8,0,117,113,1,0,0,0,117,115,1,0,0,0,118,19,1,0,0,0,119,120,
        5,16,0,0,120,121,3,26,13,0,121,122,3,14,7,0,122,21,1,0,0,0,123,124,
        5,30,0,0,124,125,5,6,0,0,125,126,3,26,13,0,126,127,5,2,0,0,127,135,
        1,0,0,0,128,129,5,17,0,0,129,130,3,26,13,0,130,131,5,6,0,0,131,132,
        3,26,13,0,132,133,5,2,0,0,133,135,1,0,0,0,134,123,1,0,0,0,134,128,
        1,0,0,0,135,23,1,0,0,0,136,137,3,26,13,0,137,138,5,2,0,0,138,25,
        1,0,0,0,139,140,6,13,-1,0,140,141,5,8,0,0,141,142,3,26,13,0,142,
        143,5,9,0,0,143,162,1,0,0,0,144,146,5,18,0,0,145,147,5,4,0,0,146,
        145,1,0,0,0,146,147,1,0,0,0,147,148,1,0,0,0,148,162,3,26,13,9,149,
        150,5,17,0,0,150,162,3,26,13,8,151,152,5,27,0,0,152,162,3,26,13,
        4,153,154,5,30,0,0,154,156,5,8,0,0,155,157,3,28,14,0,156,155,1,0,
        0,0,156,157,1,0,0,0,157,158,1,0,0,0,158,162,5,9,0,0,159,162,5,30,
        0,0,160,162,5,31,0,0,161,139,1,0,0,0,161,144,1,0,0,0,161,149,1,0,
        0,0,161,151,1,0,0,0,161,153,1,0,0,0,161,159,1,0,0,0,161,160,1,0,
        0,0,162,174,1,0,0,0,163,164,10,7,0,0,164,165,7,0,0,0,165,173,3,26,
        13,8,166,167,10,6,0,0,167,168,7,1,0,0,168,173,3,26,13,7,169,170,
        10,5,0,0,170,171,7,2,0,0,171,173,3,26,13,6,172,163,1,0,0,0,172,166,
        1,0,0,0,172,169,1,0,0,0,173,176,1,0,0,0,174,172,1,0,0,0,174,175,
        1,0,0,0,175,27,1,0,0,0,176,174,1,0,0,0,177,182,3,26,13,0,178,179,
        5,11,0,0,179,181,3,26,13,0,180,178,1,0,0,0,181,184,1,0,0,0,182,180,
        1,0,0,0,182,183,1,0,0,0,183,29,1,0,0,0,184,182,1,0,0,0,185,192,5,
        28,0,0,186,188,5,18,0,0,187,189,5,4,0,0,188,187,1,0,0,0,188,189,
        1,0,0,0,189,190,1,0,0,0,190,192,3,30,15,0,191,185,1,0,0,0,191,186,
        1,0,0,0,192,31,1,0,0,0,193,194,5,29,0,0,194,195,5,2,0,0,195,33,1,
        0,0,0,19,37,51,55,61,74,86,97,101,109,117,134,146,156,161,172,174,
        182,188,191
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!RustParser.__ATN) {
            RustParser.__ATN = new antlr.ATNDeserializer().deserialize(RustParser._serializedATN);
        }

        return RustParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(RustParser.literalNames, RustParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return RustParser.vocabulary;
    }

    private static readonly decisionsToDFA = RustParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(RustParser.EOF, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_prog;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterProg) {
             listener.enterProg(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitProg) {
             listener.exitProg(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitProg) {
            return visitor.visitProg(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variableDeclaration(): VariableDeclarationContext | null {
        return this.getRuleContext(0, VariableDeclarationContext);
    }
    public functionDeclaration(): FunctionDeclarationContext | null {
        return this.getRuleContext(0, FunctionDeclarationContext);
    }
    public assignment(): AssignmentContext | null {
        return this.getRuleContext(0, AssignmentContext);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public ifStatement(): IfStatementContext | null {
        return this.getRuleContext(0, IfStatementContext);
    }
    public whileStatement(): WhileStatementContext | null {
        return this.getRuleContext(0, WhileStatementContext);
    }
    public returnStatement(): ReturnStatementContext | null {
        return this.getRuleContext(0, ReturnStatementContext);
    }
    public breakStatement(): BreakStatementContext | null {
        return this.getRuleContext(0, BreakStatementContext);
    }
    public expressionStatement(): ExpressionStatementContext | null {
        return this.getRuleContext(0, ExpressionStatementContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_statement;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ReturnStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_returnStatement;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterReturnStatement) {
             listener.enterReturnStatement(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitReturnStatement) {
             listener.exitReturnStatement(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitReturnStatement) {
            return visitor.visitReturnStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableDeclarationContext extends antlr.ParserRuleContext {
    public _mutFlag?: Token | null;
    public _name?: Token | null;
    public _value?: ExpressionContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(RustParser.IDENTIFIER, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_variableDeclaration;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterVariableDeclaration) {
             listener.enterVariableDeclaration(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitVariableDeclaration) {
             listener.exitVariableDeclaration(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitVariableDeclaration) {
            return visitor.visitVariableDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunctionDeclarationContext extends antlr.ParserRuleContext {
    public _name?: Token | null;
    public _returnType?: TypeContext;
    public _functionBody?: BlockContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(RustParser.IDENTIFIER, 0)!;
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public paramList(): ParamListContext | null {
        return this.getRuleContext(0, ParamListContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_functionDeclaration;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterFunctionDeclaration) {
             listener.enterFunctionDeclaration(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitFunctionDeclaration) {
             listener.exitFunctionDeclaration(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitFunctionDeclaration) {
            return visitor.visitFunctionDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParamListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public param(): ParamContext[];
    public param(i: number): ParamContext | null;
    public param(i?: number): ParamContext[] | ParamContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ParamContext);
        }

        return this.getRuleContext(i, ParamContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_paramList;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterParamList) {
             listener.enterParamList(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitParamList) {
             listener.exitParamList(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitParamList) {
            return visitor.visitParamList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParamContext extends antlr.ParserRuleContext {
    public _name?: Token | null;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(RustParser.IDENTIFIER, 0)!;
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_param;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterParam) {
             listener.enterParam(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitParam) {
             listener.exitParam(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitParam) {
            return visitor.visitParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_block;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterBlock) {
             listener.enterBlock(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitBlock) {
             listener.exitBlock(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitBlock) {
            return visitor.visitBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IfStatementContext extends antlr.ParserRuleContext {
    public _condition?: ExpressionContext;
    public _thenBlock?: BlockContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public elseBranch(): ElseBranchContext | null {
        return this.getRuleContext(0, ElseBranchContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_ifStatement;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterIfStatement) {
             listener.enterIfStatement(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitIfStatement) {
             listener.exitIfStatement(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitIfStatement) {
            return visitor.visitIfStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElseBranchContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public ifStatement(): IfStatementContext | null {
        return this.getRuleContext(0, IfStatementContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_elseBranch;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterElseBranch) {
             listener.enterElseBranch(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitElseBranch) {
             listener.exitElseBranch(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitElseBranch) {
            return visitor.visitElseBranch(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class WhileStatementContext extends antlr.ParserRuleContext {
    public _condition?: ExpressionContext;
    public _loopBlock?: BlockContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_whileStatement;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterWhileStatement) {
             listener.enterWhileStatement(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitWhileStatement) {
             listener.exitWhileStatement(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitWhileStatement) {
            return visitor.visitWhileStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AssignmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_assignment;
    }
    public override copyFrom(ctx: AssignmentContext): void {
        super.copyFrom(ctx);
    }
}
export class DereferenceAssignmentContext extends AssignmentContext {
    public _target?: ExpressionContext;
    public _value?: ExpressionContext;
    public constructor(ctx: AssignmentContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterDereferenceAssignment) {
             listener.enterDereferenceAssignment(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitDereferenceAssignment) {
             listener.exitDereferenceAssignment(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitDereferenceAssignment) {
            return visitor.visitDereferenceAssignment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class StandardAssignmentContext extends AssignmentContext {
    public constructor(ctx: AssignmentContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(RustParser.IDENTIFIER, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterStandardAssignment) {
             listener.enterStandardAssignment(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitStandardAssignment) {
             listener.exitStandardAssignment(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitStandardAssignment) {
            return visitor.visitStandardAssignment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_expressionStatement;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterExpressionStatement) {
             listener.enterExpressionStatement(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitExpressionStatement) {
             listener.exitExpressionStatement(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitExpressionStatement) {
            return visitor.visitExpressionStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_expression;
    }
    public override copyFrom(ctx: ExpressionContext): void {
        super.copyFrom(ctx);
    }
}
export class IdentifierContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(RustParser.IDENTIFIER, 0)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterIdentifier) {
             listener.enterIdentifier(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitIdentifier) {
             listener.exitIdentifier(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitIdentifier) {
            return visitor.visitIdentifier(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class DereferenceExprContext extends ExpressionContext {
    public _target?: ExpressionContext;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterDereferenceExpr) {
             listener.enterDereferenceExpr(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitDereferenceExpr) {
             listener.exitDereferenceExpr(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitDereferenceExpr) {
            return visitor.visitDereferenceExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ReferenceExprContext extends ExpressionContext {
    public _target?: ExpressionContext;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterReferenceExpr) {
             listener.enterReferenceExpr(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitReferenceExpr) {
             listener.exitReferenceExpr(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitReferenceExpr) {
            return visitor.visitReferenceExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class EqualityOpContext extends ExpressionContext {
    public _left?: ExpressionContext;
    public _op?: Token | null;
    public _right?: ExpressionContext;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterEqualityOp) {
             listener.enterEqualityOp(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitEqualityOp) {
             listener.exitEqualityOp(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitEqualityOp) {
            return visitor.visitEqualityOp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class FunctionCallContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(RustParser.IDENTIFIER, 0)!;
    }
    public argList(): ArgListContext | null {
        return this.getRuleContext(0, ArgListContext);
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterFunctionCall) {
             listener.enterFunctionCall(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitFunctionCall) {
             listener.exitFunctionCall(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitFunctionCall) {
            return visitor.visitFunctionCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class UnaryOpContext extends ExpressionContext {
    public _operand?: ExpressionContext;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterUnaryOp) {
             listener.enterUnaryOp(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitUnaryOp) {
             listener.exitUnaryOp(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitUnaryOp) {
            return visitor.visitUnaryOp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class MulDivOpContext extends ExpressionContext {
    public _left?: ExpressionContext;
    public _op?: Token | null;
    public _right?: ExpressionContext;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterMulDivOp) {
             listener.enterMulDivOp(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitMulDivOp) {
             listener.exitMulDivOp(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitMulDivOp) {
            return visitor.visitMulDivOp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParenExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterParenExpr) {
             listener.enterParenExpr(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitParenExpr) {
             listener.exitParenExpr(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitParenExpr) {
            return visitor.visitParenExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IntContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INT(): antlr.TerminalNode {
        return this.getToken(RustParser.INT, 0)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterInt) {
             listener.enterInt(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitInt) {
             listener.exitInt(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitInt) {
            return visitor.visitInt(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class AddSubOpContext extends ExpressionContext {
    public _left?: ExpressionContext;
    public _op?: Token | null;
    public _right?: ExpressionContext;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterAddSubOp) {
             listener.enterAddSubOp(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitAddSubOp) {
             listener.exitAddSubOp(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitAddSubOp) {
            return visitor.visitAddSubOp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArgListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_argList;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterArgList) {
             listener.enterArgList(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitArgList) {
             listener.exitArgList(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitArgList) {
            return visitor.visitArgList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_type;
    }
    public override copyFrom(ctx: TypeContext): void {
        super.copyFrom(ctx);
    }
}
export class IntegerTypeContext extends TypeContext {
    public constructor(ctx: TypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterIntegerType) {
             listener.enterIntegerType(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitIntegerType) {
             listener.exitIntegerType(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitIntegerType) {
            return visitor.visitIntegerType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ReferenceTypeContext extends TypeContext {
    public constructor(ctx: TypeContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterReferenceType) {
             listener.enterReferenceType(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitReferenceType) {
             listener.exitReferenceType(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitReferenceType) {
            return visitor.visitReferenceType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BreakStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return RustParser.RULE_breakStatement;
    }
    public override enterRule(listener: RustListener): void {
        if(listener.enterBreakStatement) {
             listener.enterBreakStatement(this);
        }
    }
    public override exitRule(listener: RustListener): void {
        if(listener.exitBreakStatement) {
             listener.exitBreakStatement(this);
        }
    }
    public override accept<Result>(visitor: RustVisitor<Result>): Result | null {
        if (visitor.visitBreakStatement) {
            return visitor.visitBreakStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
