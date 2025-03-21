// Generated from src/SimpleLang.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { SimpleLangListener } from "./SimpleLangListener.js";
import { SimpleLangVisitor } from "./SimpleLangVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class SimpleLangParser extends antlr.Parser {
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
    public static readonly IDENTIFIER = 14;
    public static readonly INT = 15;
    public static readonly WS = 16;
    public static readonly RULE_prog = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_variableDeclaration = 2;
    public static readonly RULE_assignment = 3;
    public static readonly RULE_displayStatement = 4;
    public static readonly RULE_expressionStatement = 5;
    public static readonly RULE_expression = 6;

    public static readonly literalNames = [
        null, "'const'", "'let'", "'mut'", "'='", "';'", "'display'", "'('", 
        "')'", "'*'", "'/'", "'+'", "'-'", "'&'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, "IDENTIFIER", "INT", "WS"
    ];
    public static readonly ruleNames = [
        "prog", "statement", "variableDeclaration", "assignment", "displayStatement", 
        "expressionStatement", "expression",
    ];

    public get grammarFileName(): string { return "SimpleLang.g4"; }
    public get literalNames(): (string | null)[] { return SimpleLangParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return SimpleLangParser.symbolicNames; }
    public get ruleNames(): string[] { return SimpleLangParser.ruleNames; }
    public get serializedATN(): number[] { return SimpleLangParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, SimpleLangParser._ATN, SimpleLangParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public prog(): ProgContext {
        let localContext = new ProgContext(this.context, this.state);
        this.enterRule(localContext, 0, SimpleLangParser.RULE_prog);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 17;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 57542) !== 0)) {
                {
                {
                this.state = 14;
                this.statement();
                }
                }
                this.state = 19;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 20;
            this.match(SimpleLangParser.EOF);
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
        this.enterRule(localContext, 2, SimpleLangParser.RULE_statement);
        try {
            this.state = 26;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 22;
                this.variableDeclaration();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 23;
                this.assignment();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 24;
                this.displayStatement();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 25;
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
    public variableDeclaration(): VariableDeclarationContext {
        let localContext = new VariableDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 4, SimpleLangParser.RULE_variableDeclaration);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 33;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SimpleLangParser.T__0:
                {
                this.state = 28;
                this.match(SimpleLangParser.T__0);
                }
                break;
            case SimpleLangParser.T__1:
                {
                this.state = 29;
                this.match(SimpleLangParser.T__1);
                this.state = 31;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 3) {
                    {
                    this.state = 30;
                    this.match(SimpleLangParser.T__2);
                    }
                }

                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.state = 35;
            this.match(SimpleLangParser.IDENTIFIER);
            this.state = 36;
            this.match(SimpleLangParser.T__3);
            this.state = 37;
            this.expression(0);
            this.state = 38;
            this.match(SimpleLangParser.T__4);
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
        this.enterRule(localContext, 6, SimpleLangParser.RULE_assignment);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 40;
            this.match(SimpleLangParser.IDENTIFIER);
            this.state = 41;
            this.match(SimpleLangParser.T__3);
            this.state = 42;
            this.expression(0);
            this.state = 43;
            this.match(SimpleLangParser.T__4);
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
    public displayStatement(): DisplayStatementContext {
        let localContext = new DisplayStatementContext(this.context, this.state);
        this.enterRule(localContext, 8, SimpleLangParser.RULE_displayStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 45;
            this.match(SimpleLangParser.T__5);
            this.state = 46;
            this.match(SimpleLangParser.T__6);
            this.state = 47;
            this.match(SimpleLangParser.IDENTIFIER);
            this.state = 48;
            this.match(SimpleLangParser.T__7);
            this.state = 49;
            this.match(SimpleLangParser.T__4);
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
        this.enterRule(localContext, 10, SimpleLangParser.RULE_expressionStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 51;
            this.expression(0);
            this.state = 52;
            this.match(SimpleLangParser.T__4);
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
        let _startState = 12;
        this.enterRecursionRule(localContext, 12, SimpleLangParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 66;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SimpleLangParser.T__6:
                {
                this.state = 55;
                this.match(SimpleLangParser.T__6);
                this.state = 56;
                this.expression(0);
                this.state = 57;
                this.match(SimpleLangParser.T__7);
                }
                break;
            case SimpleLangParser.T__12:
                {
                this.state = 59;
                this.match(SimpleLangParser.T__12);
                this.state = 61;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 3) {
                    {
                    this.state = 60;
                    this.match(SimpleLangParser.T__2);
                    }
                }

                this.state = 63;
                this.match(SimpleLangParser.IDENTIFIER);
                }
                break;
            case SimpleLangParser.IDENTIFIER:
                {
                this.state = 64;
                this.match(SimpleLangParser.IDENTIFIER);
                }
                break;
            case SimpleLangParser.INT:
                {
                this.state = 65;
                this.match(SimpleLangParser.INT);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 73;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    {
                    localContext = new ExpressionContext(parentContext, parentState);
                    this.pushNewRecursionContext(localContext, _startState, SimpleLangParser.RULE_expression);
                    this.state = 68;
                    if (!(this.precpred(this.context, 4))) {
                        throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                    }
                    this.state = 69;
                    localContext._op = this.tokenStream.LT(1);
                    _la = this.tokenStream.LA(1);
                    if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 7680) !== 0))) {
                        localContext._op = this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 70;
                    this.expression(5);
                    }
                    }
                }
                this.state = 75;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 6, this.context);
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

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 6:
            return this.expression_sempred(localContext as ExpressionContext, predIndex);
        }
        return true;
    }
    private expression_sempred(localContext: ExpressionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 4);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,16,77,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,1,0,5,0,16,8,0,10,0,12,0,19,9,0,1,0,1,0,1,1,1,1,1,1,1,1,3,1,27,
        8,1,1,2,1,2,1,2,3,2,32,8,2,3,2,34,8,2,1,2,1,2,1,2,1,2,1,2,1,3,1,
        3,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,6,1,6,1,6,1,
        6,1,6,1,6,1,6,3,6,62,8,6,1,6,1,6,1,6,3,6,67,8,6,1,6,1,6,1,6,5,6,
        72,8,6,10,6,12,6,75,9,6,1,6,0,1,12,7,0,2,4,6,8,10,12,0,1,1,0,9,12,
        80,0,17,1,0,0,0,2,26,1,0,0,0,4,33,1,0,0,0,6,40,1,0,0,0,8,45,1,0,
        0,0,10,51,1,0,0,0,12,66,1,0,0,0,14,16,3,2,1,0,15,14,1,0,0,0,16,19,
        1,0,0,0,17,15,1,0,0,0,17,18,1,0,0,0,18,20,1,0,0,0,19,17,1,0,0,0,
        20,21,5,0,0,1,21,1,1,0,0,0,22,27,3,4,2,0,23,27,3,6,3,0,24,27,3,8,
        4,0,25,27,3,10,5,0,26,22,1,0,0,0,26,23,1,0,0,0,26,24,1,0,0,0,26,
        25,1,0,0,0,27,3,1,0,0,0,28,34,5,1,0,0,29,31,5,2,0,0,30,32,5,3,0,
        0,31,30,1,0,0,0,31,32,1,0,0,0,32,34,1,0,0,0,33,28,1,0,0,0,33,29,
        1,0,0,0,34,35,1,0,0,0,35,36,5,14,0,0,36,37,5,4,0,0,37,38,3,12,6,
        0,38,39,5,5,0,0,39,5,1,0,0,0,40,41,5,14,0,0,41,42,5,4,0,0,42,43,
        3,12,6,0,43,44,5,5,0,0,44,7,1,0,0,0,45,46,5,6,0,0,46,47,5,7,0,0,
        47,48,5,14,0,0,48,49,5,8,0,0,49,50,5,5,0,0,50,9,1,0,0,0,51,52,3,
        12,6,0,52,53,5,5,0,0,53,11,1,0,0,0,54,55,6,6,-1,0,55,56,5,7,0,0,
        56,57,3,12,6,0,57,58,5,8,0,0,58,67,1,0,0,0,59,61,5,13,0,0,60,62,
        5,3,0,0,61,60,1,0,0,0,61,62,1,0,0,0,62,63,1,0,0,0,63,67,5,14,0,0,
        64,67,5,14,0,0,65,67,5,15,0,0,66,54,1,0,0,0,66,59,1,0,0,0,66,64,
        1,0,0,0,66,65,1,0,0,0,67,73,1,0,0,0,68,69,10,4,0,0,69,70,7,0,0,0,
        70,72,3,12,6,5,71,68,1,0,0,0,72,75,1,0,0,0,73,71,1,0,0,0,73,74,1,
        0,0,0,74,13,1,0,0,0,75,73,1,0,0,0,7,17,26,31,33,61,66,73
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!SimpleLangParser.__ATN) {
            SimpleLangParser.__ATN = new antlr.ATNDeserializer().deserialize(SimpleLangParser._serializedATN);
        }

        return SimpleLangParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(SimpleLangParser.literalNames, SimpleLangParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return SimpleLangParser.vocabulary;
    }

    private static readonly decisionsToDFA = SimpleLangParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.EOF, 0)!;
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
        return SimpleLangParser.RULE_prog;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterProg) {
             listener.enterProg(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitProg) {
             listener.exitProg(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
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
    public assignment(): AssignmentContext | null {
        return this.getRuleContext(0, AssignmentContext);
    }
    public displayStatement(): DisplayStatementContext | null {
        return this.getRuleContext(0, DisplayStatementContext);
    }
    public expressionStatement(): ExpressionStatementContext | null {
        return this.getRuleContext(0, ExpressionStatementContext);
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_statement;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_variableDeclaration;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterVariableDeclaration) {
             listener.enterVariableDeclaration(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitVariableDeclaration) {
             listener.exitVariableDeclaration(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitVariableDeclaration) {
            return visitor.visitVariableDeclaration(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AssignmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_assignment;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterAssignment) {
             listener.enterAssignment(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitAssignment) {
             listener.exitAssignment(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitAssignment) {
            return visitor.visitAssignment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DisplayStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0)!;
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_displayStatement;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterDisplayStatement) {
             listener.enterDisplayStatement(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitDisplayStatement) {
             listener.exitDisplayStatement(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitDisplayStatement) {
            return visitor.visitDisplayStatement(this);
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
        return SimpleLangParser.RULE_expressionStatement;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterExpressionStatement) {
             listener.enterExpressionStatement(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitExpressionStatement) {
             listener.exitExpressionStatement(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitExpressionStatement) {
            return visitor.visitExpressionStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionContext extends antlr.ParserRuleContext {
    public _op?: Token | null;
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
    public IDENTIFIER(): antlr.TerminalNode | null {
        return this.getToken(SimpleLangParser.IDENTIFIER, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SimpleLangParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return SimpleLangParser.RULE_expression;
    }
    public override enterRule(listener: SimpleLangListener): void {
        if(listener.enterExpression) {
             listener.enterExpression(this);
        }
    }
    public override exitRule(listener: SimpleLangListener): void {
        if(listener.exitExpression) {
             listener.exitExpression(this);
        }
    }
    public override accept<Result>(visitor: SimpleLangVisitor<Result>): Result | null {
        if (visitor.visitExpression) {
            return visitor.visitExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
